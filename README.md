# Finverse 2.0 🚀
### The Autonomous AI CFO & Financial Digital Twin

Finverse 2.0 is a next-generation financial intelligence platform that uses a swarm of autonomous AI agents to manage, forecast, and optimize your financial life. It goes beyond simple tracking by creating a **"FinTwin"**—a digital twin of your finances that simulates future scenarios in real-time.

![Finverse Dashboard](https://via.placeholder.com/800x400?text=Finverse+2.0+Dashboard)

## 🌟 Key Features

### 🧠 FinTwin v3 (Financial Digital Twin)
A holographic simulation engine that projects your financial future 12 months ahead.
- **5-Agent Pipeline**: Orchestrates `Data`, `Forecast`, `Risk`, `TwinAnalysis`, and `Advice` agents in parallel for real-time insights.
- **Scenario Simulation**: Ask "What if I buy a Tesla?" and see the impact on your runway instantly.
- **Risk Detection**: AI analyzes burn rate, liquidity, and dependency risks.

### 🤖 Autonomous Agent Swarm
A team of specialized agents working 24/7 for you:
- **DataAgent**: Aggregates transactions from banks and external APIs (with fallback safety nets).
- **ForecastAgent**: Predicts future income and expenses using statistical models.
- **RiskAgent**: Identifies financial vulnerabilities.
- **ComplianceAgent**: Checks transactions against regulatory documents (integrated RAG from live sources).
- **TaxAgent**: Estimates tax liabilities and generates reports.
- **AdviceAgent**: Provides strategic financial coaching via LLM.

### ⚡ Performance & Reliability
- **Parallel Execution**: Optimized orchestration runs independent agents concurrently for lightning-fast simulations.
- **Robust Fallbacks**: Automatic baseline calculations ensure you always see data, even if AI services are interrupted.
- **RAG Integration**: Fetches live regulatory documents for up-to-date compliance checks.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Lucide React
- **AI/LLM**: OpenRouter (NVIDIA Nemotron, etc.), LangChain concepts
- **Database**: SQLite (Dev) / PostgreSQL (Prod ready)
- **Orchestration**: Custom async python agent orchestrator

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- OpenRouter API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/finverse-2.0.git
    cd finverse-2.0
    ```

2.  **Backend Setup**
    ```bash
    # Create virtual environment
    python -m venv .venv
    source .venv/bin/activate  # or .venv\Scripts\activate on Windows

    # Install dependencies
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```

4.  **Configuration**
    Create a `.env` file in the root directory:
    ```env
    OPENROUTER_API_KEY=your_api_key_here
    DATABASE_URL=sqlite:///./finverse.db
    ```

### Running the System

We provide a convenient PowerShell script to start both backend and frontend:

```powershell
.\run_system.ps1
```

Or run them manually:

**Backend:**
```bash
uvicorn orchestrator:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`.

## 📂 Project Structure

```
Finverse 2.0/
├── agents/                 # Autonomous Agent Logic
│   ├── data_agent.py       # Data ingestion & cleaning
│   ├── forecast_agent.py   # Predictive modeling
│   ├── risk_agent.py       # Risk analysis
│   ├── compliance_agent.py # Regulatory checks (RAG)
│   └── ...
├── frontend/               # React Application
│   ├── src/pages/          # FinTwin, Dashboard, etc.
│   └── ...
├── orchestrator.py         # Main FastAPI Application & Agent Orchestrator
├── database.py             # DB Models & Connection
└── run_system.ps1          # Startup Script
```

## 🛡️ Security

- **Data Privacy**: Financial data is processed locally or via secure API tunnels.
- **Governance**: A dedicated `GovernanceAgent` validates all AI outputs before they reach the user.

## 📄 License

MIT License. Built for the Future of Finance.
