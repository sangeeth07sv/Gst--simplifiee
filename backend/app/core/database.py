from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Print the database URL being used (password hidden)
db_url = settings.database_url

if "@" in db_url and ":" in db_url:
    try:
        prefix, rest = db_url.split("://", 1)
        creds, host = rest.split("@", 1)
        username = creds.split(":")[0]
        print(f"✅ DATABASE USER: {username}")
        print(f"✅ DATABASE HOST: {host}")
    except Exception:
        print("DATABASE_URL =", db_url)
else:
    print("DATABASE_URL =", db_url)

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
