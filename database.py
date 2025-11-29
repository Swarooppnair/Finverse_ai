from sqlalchemy import create_engine, Column, Integer, String, Text, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

DATABASE_URL = "sqlite:///./data/finverse.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class AgentModel(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String) # 'prebuilt', 'custom', 'rag'
    description = Column(Text, nullable=True)
    api_key = Column(String, nullable=True)
    context = Column(Text, nullable=True)
    files = Column(JSON, nullable=True) # List of file paths for RAG
    status = Column(String, default="idle")
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkflowModel(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    nodes = Column(JSON)
    edges = Column(JSON)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    date = Column(String)
    amount = Column(Integer) # Storing as integer/float
    type = Column(String) # 'income' or 'expense'
    category = Column(String)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class GoalModel(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    target_amount = Column(Integer)
    current_amount = Column(Integer)
    deadline = Column(String)
    priority = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
