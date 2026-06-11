"""
Tests for service methods added/fixed during the code review.

Covers the endpoint-facing portfolio asset/alert/export/sync helpers, the
analytics service endpoint methods, and the risk service public wrappers that
the API layer depends on. These exercise the methods that were previously
missing (and therefore guaranteed 500s at runtime).
"""

from datetime import datetime, timezone
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch
from uuid import uuid4

import pytest
from models.portfolio import Portfolio, PortfolioAsset
from services.analytics.analytics_service import AnalyticsService
from services.portfolio.portfolio_service import PortfolioService
from sqlalchemy.ext.asyncio import AsyncSession


def _portfolio(**overrides):
    base = dict(
        id=uuid4(),
        user_id=uuid4(),
        name="P",
        cash_balance=Decimal("10000"),
        total_value_usd=Decimal("10000"),
        total_cost_basis=Decimal("8000"),
    )
    base.update(overrides)
    return Portfolio(**base)


@pytest.fixture
def db():
    return AsyncMock(spec=AsyncSession)


@pytest.fixture
def service(db):
    return PortfolioService(db)


class TestPortfolioAssetApi:
    @pytest.mark.asyncio
    async def test_get_portfolio_assets(self, service, db):
        portfolio = _portfolio()
        assets = [PortfolioAsset(asset_symbol="BTC", quantity=Decimal("1"))]
        db.execute = AsyncMock(
            side_effect=[
                Mock(scalar_one_or_none=Mock(return_value=portfolio)),
                Mock(scalars=Mock(return_value=Mock(all=Mock(return_value=assets)))),
            ]
        )
        result = await service.get_portfolio_assets(portfolio.id, portfolio.user_id)
        assert len(result) == 1

    @pytest.mark.asyncio
    async def test_add_portfolio_asset(self, service, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        db.add = Mock()
        db.commit = AsyncMock()
        db.refresh = AsyncMock()
        payload = SimpleNamespace(
            model_dump=lambda exclude_unset=True: {
                "symbol": "ETH",
                "asset_type": "cryptocurrency",
                "quantity": Decimal("3"),
                "average_cost": Decimal("2000"),
            }
        )
        with patch.object(service, "_get_current_price", return_value=None):
            asset = await service.add_portfolio_asset(
                portfolio.id, portfolio.user_id, payload
            )
        assert asset.asset_symbol == "ETH"
        assert asset.quantity == Decimal("3")
        db.add.assert_called_once()

    @pytest.mark.asyncio
    async def test_add_portfolio_asset_requires_quantity(self, service, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        payload = SimpleNamespace(
            model_dump=lambda exclude_unset=True: {"symbol": "ETH", "quantity": 0}
        )
        with pytest.raises(ValueError):
            await service.add_portfolio_asset(portfolio.id, portfolio.user_id, payload)

    @pytest.mark.asyncio
    async def test_export_portfolio_data(self, service, db):
        portfolio = _portfolio()
        asset = PortfolioAsset(
            asset_symbol="BTC",
            asset_type="cryptocurrency",
            quantity=Decimal("1"),
            average_cost=Decimal("100"),
            current_price=Decimal("120"),
            current_value_usd=Decimal("120"),
        )
        db.execute = AsyncMock(
            side_effect=[
                Mock(scalar_one_or_none=Mock(return_value=portfolio)),  # get
                Mock(scalar_one_or_none=Mock(return_value=portfolio)),  # assets get
                Mock(scalars=Mock(return_value=Mock(all=Mock(return_value=[asset])))),
            ]
        )
        export = await service.export_portfolio_data(
            portfolio.id, portfolio.user_id, format="csv", include_transactions=False
        )
        assert export["format"] == "csv"
        assert "content" in export
        assert "BTC" in export["content"]

    @pytest.mark.asyncio
    async def test_sync_validates_addresses(self, service, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        with pytest.raises(ValueError):
            await service.sync_portfolio_with_blockchain(
                portfolio.id, portfolio.user_id, ["not-an-address"]
            )

    @pytest.mark.asyncio
    async def test_sync_persists_addresses(self, service, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        db.commit = AsyncMock()
        addr = "0x" + "a" * 40
        await service.sync_portfolio_with_blockchain(
            portfolio.id, portfolio.user_id, [addr]
        )
        assert portfolio.wallet_address == addr
        assert portfolio.extra_metadata["synced_wallet_addresses"] == [addr]

    @pytest.mark.asyncio
    async def test_create_portfolio_alert(self, service, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        db.add = Mock()
        db.commit = AsyncMock()
        db.refresh = AsyncMock()
        alert = await service.create_portfolio_alert(
            portfolio.id,
            portfolio.user_id,
            {"rule_name": "Drawdown", "rule_type": "drawdown", "threshold_value": 0.2},
        )
        assert alert["rule_name"] == "Drawdown"
        db.add.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_portfolio_alert_requires_name(self, service, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        with pytest.raises(ValueError):
            await service.create_portfolio_alert(portfolio.id, portfolio.user_id, {})

    @pytest.mark.asyncio
    async def test_get_portfolio_alerts(self, service, db):
        portfolio = _portfolio()
        alert = SimpleNamespace(
            id=uuid4(),
            rule_name="Vol",
            rule_type="volatility",
            threshold_value=Decimal("0.3"),
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        db.execute = AsyncMock(
            side_effect=[
                Mock(scalar_one_or_none=Mock(return_value=portfolio)),
                Mock(scalars=Mock(return_value=Mock(all=Mock(return_value=[alert])))),
            ]
        )
        alerts = await service.get_portfolio_alerts(portfolio.id, portfolio.user_id)
        assert alerts[0]["rule_name"] == "Vol"


class TestAnalyticsEndpoints:
    @pytest.fixture
    def db(self):
        return AsyncMock(spec=AsyncSession)

    @pytest.mark.asyncio
    async def test_get_portfolio_analytics(self, db):
        portfolio = _portfolio(total_value_usd=Decimal("12000"))
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        svc = AnalyticsService(db)
        result = await svc.get_portfolio_analytics(
            portfolio.id, portfolio.user_id, "30d"
        )
        assert result["total_value"] == Decimal("12000")
        # return = 12000 - 8000 cost basis
        assert result["total_return"] == Decimal("4000")

    @pytest.mark.asyncio
    async def test_get_portfolio_performance(self, db):
        portfolio = _portfolio()
        db.execute = AsyncMock(
            return_value=Mock(scalar_one_or_none=Mock(return_value=portfolio))
        )
        svc = AnalyticsService(db)
        result = await svc.get_portfolio_performance(
            portfolio.id, portfolio.user_id, "7d", benchmark="BTC"
        )
        assert result["period"] == "7d"
        assert result["benchmark"] == "BTC"


class TestRiskPublicMethods:
    @pytest.mark.asyncio
    async def test_calculate_risk_metrics_invalid_id(self):
        from services.risk.risk_service import RiskService

        svc = RiskService(AsyncMock(spec=AsyncSession))
        result = await svc.calculate_risk_metrics("not-a-uuid", "also-bad")
        assert result is None

    @pytest.mark.asyncio
    async def test_perform_stress_test_invalid_id(self):
        from services.risk.risk_service import RiskService

        svc = RiskService(AsyncMock(spec=AsyncSession))
        result = await svc.perform_stress_test("bad", "bad", "Market Crash")
        assert result["results"] == []

    @pytest.mark.asyncio
    async def test_calculate_risk_metrics_not_found(self):
        from services.risk.risk_service import RiskService

        svc = RiskService(AsyncMock(spec=AsyncSession))
        with patch.object(
            svc, "_get_portfolio_with_assets", AsyncMock(return_value=None)
        ):
            result = await svc.calculate_risk_metrics(uuid4(), uuid4())
        assert result is None

    @pytest.mark.asyncio
    async def test_perform_stress_test_selects_scenario(self):
        from services.risk.risk_service import RiskService

        svc = RiskService(AsyncMock(spec=AsyncSession))
        scenarios = [
            {"scenario": "Market Crash", "loss": 0.3},
            {"scenario": "Liquidity Crisis", "loss": 0.2},
        ]
        with patch.object(
            svc, "_get_portfolio_with_assets", AsyncMock(return_value=object())
        ), patch.object(
            svc, "_perform_stress_tests", AsyncMock(return_value=scenarios)
        ):
            result = await svc.perform_stress_test(uuid4(), uuid4(), "Market Crash")
        assert result["selected"]["loss"] == 0.3
        assert len(result["results"]) == 2
