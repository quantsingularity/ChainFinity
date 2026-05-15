# ChainFinity Code

This directory contains the core application code for ChainFinity, a blockchain-based financial platform designed for institutional-grade portfolio management, risk assessment, market analytics, and DeFi protocol integration. The code is organized into three primary areas: the FastAPI backend, machine learning models for financial intelligence, and the blockchain smart contract layer.

## Directory Structure

```
code/
├── backend/           # FastAPI backend services and API layer
├── ai_models/         # Machine learning models for crypto financial intelligence
└── blockchain/        # Solidity smart contracts and blockchain tooling
```

## Backend

The `backend/` directory houses the main application server built with Python and FastAPI. It is a production-ready, enterprise-grade backend emphasizing financial industry standards, comprehensive security, regulatory compliance, and multi-chain blockchain integration.

### Key Components

| Directory     | Purpose                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `app/`        | FastAPI application factory, route registration, and core app setup                              |
| `config/`     | Environment-specific configuration, security policies, and feature flags                         |
| `services/`   | Core business logic for portfolios, transactions, risk assessment, and blockchain interactions   |
| `models/`     | SQLAlchemy ORM models for users, portfolios, transactions, compliance records, and risk metrics  |
| `schemas/`    | Pydantic request/response validation schemas                                                     |
| `routes/`     | API endpoint definitions organized by domain (auth, users, portfolios, transactions, compliance) |
| `middleware/` | Custom middleware for authentication, rate limiting, logging, and CORS                           |
| `exceptions/` | Custom exception classes and global error handlers                                               |
| `monitoring/` | Prometheus metrics, structured logging, and health check endpoints                               |
| `migrations/` | Alembic database migration scripts                                                               |
| `nginx/`      | Nginx reverse proxy and load balancer configuration                                              |
| `scripts/`    | Operational and utility scripts                                                                  |
| `tests/`      | Comprehensive test suite including unit, integration, and functional tests                       |

### Notable Features

- **Enterprise Security**: JWT authentication with refresh tokens, TOTP multi-factor authentication, role-based access control, sliding window rate limiting, field-level PII encryption, bcrypt password hashing, and account lockout protection
- **Financial Compliance**: KYC/AML integration with identity and document verification, sanctions screening, PEP checks, real-time transaction monitoring, suspicious activity detection, and regulatory reporting
- **Risk Management**: Portfolio risk metrics, real-time risk scoring, position limits and controls, stress testing capabilities, and risk-based alerting
- **Blockchain Integration**: Multi-chain support via Web3.py for Ethereum, Polygon, and BSC networks; smart contract interaction and transaction management
- **Scalable Infrastructure**: Async database operations with SQLAlchemy, Redis caching and session management, connection pooling, Docker support, and horizontal scaling via Docker Compose

### Running the Backend

Local development:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m uvicorn main:app --reload
```

With Docker:

```bash
cd backend
docker-compose up -d
```

Services included in Docker Compose:

| Service    | Purpose                         |
| ---------- | ------------------------------- |
| API        | ChainFinity backend application |
| PostgreSQL | Primary transactional database  |
| Redis      | Cache and session store         |
| Nginx      | Reverse proxy and load balancer |
| Prometheus | Metrics collection              |
| Grafana    | Monitoring dashboards           |

For full backend documentation, see [backend/README.md](backend/README.md).

## AI Models

The `ai_models/` directory contains the machine learning stack that powers ChainFinity's predictive analytics and intelligent risk detection for cryptocurrency markets. Models are built with Python data science libraries and trained on historical on-chain and market data.

### Key Components

| Module                       | Purpose                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `exploit_detection_model.py` | Detects smart contract exploits and anomalous transaction patterns that may indicate security vulnerabilities or attacks |
| `liquidity_crisis_model.py`  | Predicts liquidity crises in pools and protocols by analyzing depth, volume, and withdrawal patterns                     |
| `smart_money_tracker.py`     | Identifies and tracks "smart money" wallet movements to surface institutional-level trading signals                      |
| `volatility_forecaster.py`   | Forecasts price volatility across assets using historical price data and on-chain metrics                                |
| `train_correlation_model.py` | Trains correlation models that capture relationships between assets, protocols, and market events                        |
| `data_preprocessing.py`      | Shared data cleaning, feature engineering, and normalization pipeline for all models                                     |

### Technology Stack

| Component           | Technology          |
| ------------------- | ------------------- |
| Languages           | Python 3.11+        |
| ML Frameworks       | TensorFlow, PyTorch |
| Data Processing     | Pandas, NumPy       |
| Visualization       | Plotly, Matplotlib  |
| Experiment Tracking | MLflow              |

### Running the Models

Individual models can be executed directly for training or inference:

```bash
cd ai_models
pip install -r requirements.txt
python volatility_forecaster.py
python exploit_detection_model.py
```

The preprocessing pipeline in `data_preprocessing.py` is imported by all model scripts to ensure consistent feature engineering across the platform.

## Blockchain

The `blockchain/` directory contains the Solidity smart contract layer and blockchain tooling for ChainFinity's on-chain operations. It supports the Ethereum ecosystem using Hardhat as the development framework.

### Key Components

| Directory/File      | Purpose                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `contracts/`        | Solidity smart contracts for portfolio management, asset custody, and DeFi integrations          |
| `subgraph/`         | The Graph protocol subgraph configuration for indexing on-chain events and making them queryable |
| `test/`             | Hardhat test suite using Waffle/Chai for contract validation                                     |
| `hardhat.config.js` | Hardhat network configuration for Ethereum, Polygon, and BSC deployments                         |
| `package.json`      | Node.js dependencies including Hardhat, OpenZeppelin contracts, Waffle, and Chai                 |

### Technology Stack

| Component        | Technology             |
| ---------------- | ---------------------- |
| Language         | Solidity 0.8.19+       |
| Framework        | Hardhat / Foundry      |
| Networks         | Ethereum, Polygon, BSC |
| Contract Library | OpenZeppelin Contracts |
| Testing          | Waffle + Chai          |
| Indexing         | The Graph (subgraph)   |

### Working with Smart Contracts

Compile contracts:

```bash
cd blockchain
npm install
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```

Deploy to a network:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Technology Stack Summary

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Backend        | Python 3.11+, FastAPI 0.104.1             |
| Database       | PostgreSQL 15+ with async SQLAlchemy      |
| Cache          | Redis 7+                                  |
| Authentication | JWT with refresh tokens, TOTP MFA         |
| Blockchain     | Solidity 0.8.19+, Hardhat, Web3.py        |
| Networks       | Ethereum, Polygon, BSC                    |
| ML/AI          | TensorFlow, PyTorch, Pandas, NumPy        |
| Monitoring     | Prometheus, Grafana, structured logging   |
| Deployment     | Docker, Docker Compose, Nginx             |
| Testing        | pytest (backend), Waffle/Chai (contracts) |

## Integration Between Components

The three code areas work together as an integrated platform:

1. The **backend** serves as the central API layer, handling user authentication, portfolio management, compliance workflows, and risk assessments. It communicates with the blockchain layer via Web3.py to read on-chain data and submit transactions.

2. The **AI models** are called by backend services during portfolio analysis, risk evaluation, and market monitoring operations. Predictions from the exploit detection, volatility forecasting, and liquidity crisis models feed directly into the risk scoring engine and alerting system.

3. The **blockchain** layer provides the trustless, on-chain settlement and custody layer. Smart contracts manage asset allocations and DeFi interactions, while the subgraph indexes events for efficient querying by the backend.

## Testing

Each subdirectory maintains its own test suite:

| Component       | Test Location      | Framework               |
| --------------- | ------------------ | ----------------------- |
| Backend         | `backend/tests/`   | pytest                  |
| Smart Contracts | `blockchain/test/` | Hardhat + Waffle + Chai |

Run all backend tests:

```bash
cd backend
pytest
```

Run contract tests:

```bash
cd blockchain
npx hardhat test
```

## Environment Setup

Before running any component, copy and configure the environment files:

```bash
cd backend && cp .env.example .env
cd ../blockchain && cp .env.example .env  # if available
```

Required environment variables include database URIs, Redis connection strings, JWT secrets, blockchain RPC endpoints, and API keys for external market data providers.
