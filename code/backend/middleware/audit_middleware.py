"""
Audit logging middleware and utility functions
"""

import logging
from typing import Optional

from models.compliance import AuditEventType, AuditLog
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


def _jsonable(data: Optional[dict]) -> Optional[dict]:
    """Best-effort conversion of arbitrary values to JSON-safe primitives."""
    if not data:
        return None

    def convert(value):
        if isinstance(value, dict):
            return {k: convert(v) for k, v in value.items()}
        if isinstance(value, (list, tuple, set)):
            return [convert(v) for v in value]
        if isinstance(value, (str, int, float, bool)) or value is None:
            return value
        return str(value)

    return convert(data)


async def audit_log(
    db: AsyncSession,
    user_id: Optional[str],
    event_name: str,
    entity_type: str,
    entity_id: str,
    changes: Optional[dict] = None,
    new_values: Optional[dict] = None,
    old_values: Optional[dict] = None,
    ip_address: Optional[str] = None,
    event_type: AuditEventType = AuditEventType.SYSTEM_EVENT,
) -> None:
    """
    Create an audit log entry.

    Accepts both the generic ``changes`` dict and the ``new_values`` /
    ``old_values`` kwargs used throughout the API layer (the old signature
    only accepted ``changes``, so every endpoint passing ``new_values=``
    raised TypeError and lost its audit trail).
    """
    try:
        metadata: dict = {}
        if changes:
            metadata.update(changes)
        if new_values:
            metadata["new_values"] = new_values
        if old_values:
            metadata["old_values"] = old_values
        log_entry = AuditLog(
            user_id=user_id,
            event_type=event_type,
            event_name=event_name,
            event_description=f"{event_name} on {entity_type}:{entity_id}",
            entity_type=entity_type,
            entity_id=entity_id,
            extra_metadata=_jsonable(metadata) or None,
            ip_address=ip_address,
        )
        db.add(log_entry)
        await db.commit()
        logger.info(f"Audit log created: {event_name} for {entity_type}:{entity_id}")
    except Exception as e:
        logger.error(f"Failed to create audit log: {e}")
        # Don't fail the request if audit logging fails
