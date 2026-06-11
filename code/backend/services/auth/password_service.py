"""
Password Service
Handles password hashing, verification, and strength validation.

Implemented directly on top of the `bcrypt` library. The previous
implementation used passlib's CryptContext, but passlib 1.7.4 is unmaintained
and breaks at runtime with bcrypt >= 4.1 (it probes the removed
`bcrypt.__about__` attribute and then mis-handles hashing). Using bcrypt
directly keeps full compatibility with existing `$2b$` hashes.
"""

import hashlib
import logging
import re
from typing import Optional, Tuple

import bcrypt
from config.settings import settings

logger = logging.getLogger(__name__)

# Work factor for new hashes. 12 is the common production default.
BCRYPT_ROUNDS = 12


def _prepare_password(password: str) -> bytes:
    """Normalise a password for bcrypt.

    bcrypt silently truncates input at 72 bytes (and bcrypt >= 4.1 raises
    instead). Pre-hashing longer passwords with SHA-256 keeps their full
    entropy while always staying under the limit.
    """
    encoded = password.encode("utf-8")
    if len(encoded) > 72:
        encoded = hashlib.sha256(encoded).hexdigest().encode("ascii")
    return encoded


class PasswordService:
    """
    Service for password operations
    """

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plain text password"""
        salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
        return bcrypt.hashpw(_prepare_password(password), salt).decode("ascii")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        try:
            return bcrypt.checkpw(
                _prepare_password(plain_password),
                hashed_password.encode("ascii"),
            )
        except (ValueError, TypeError) as e:
            logger.error(f"Password verification error: {e}")
            return False

    @staticmethod
    def validate_password_strength(password: str) -> Tuple[bool, Optional[str]]:
        """
        Validate password strength according to security policy.
        Returns (is_valid, error_message)
        """
        if len(password) < settings.PASSWORD_MIN_LENGTH:
            return (
                False,
                f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters long",
            )
        if settings.PASSWORD_REQUIRE_UPPERCASE and not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"
        if settings.PASSWORD_REQUIRE_LOWERCASE and not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"
        if settings.PASSWORD_REQUIRE_NUMBERS and not re.search(r"\d", password):
            return False, "Password must contain at least one digit"
        if settings.PASSWORD_REQUIRE_SPECIAL and not re.search(
            r'[!@#$%^&*(),.?":{}|<>]', password
        ):
            return False, "Password must contain at least one special character"
        return True, None

    @staticmethod
    def _validate_password_strength(password: str) -> None:
        """
        Validate password strength, raising ValueError if invalid.
        Used internally; raises on failure rather than returning a tuple.
        """
        is_valid, error_message = PasswordService.validate_password_strength(password)
        if not is_valid:
            raise ValueError(error_message)

    @staticmethod
    def needs_rehash(hashed_password: str) -> bool:
        """Check if password hash needs to be updated (e.g. lower cost factor)"""
        try:
            parts = hashed_password.split("$")
            # Format: $2b$<rounds>$<salt+digest>
            return int(parts[2]) < BCRYPT_ROUNDS
        except (IndexError, ValueError):
            # Unknown / malformed hash: rehash on next successful login
            return True

    @staticmethod
    def generate_temporary_password(length: int = 16) -> str:
        """Generate a secure temporary password"""
        import secrets
        import string

        alphabet = string.ascii_letters + string.digits + "!@#$%^&*()"
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        # Ensure it meets requirements
        if not re.search(r"[A-Z]", password):
            password = password[:-1] + "A"
        if not re.search(r"[a-z]", password):
            password = password[:-2] + "a" + password[-1]
        if not re.search(r"\d", password):
            password = password[:-3] + "1" + password[-2:]
        if not re.search(r"[!@#$%^&*()]", password):
            password = password[:-4] + "!" + password[-3:]
        return password
