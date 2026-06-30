from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file.
# The database will be created locally in the backend folder as bugtrack.db.
DATABASE_URL = "sqlite:///./bugtrack.db"

# Engine is the connection between SQLAlchemy and the SQLite database.
# check_same_thread=False is needed because FastAPI can handle requests in different threads.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# SessionLocal is used to create database sessions.
# Each API request will open a session, use the database, and then close it.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base is used by SQLAlchemy models.
# Every database table class will inherit from this Base.
Base = declarative_base()