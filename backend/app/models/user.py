import enum
import uuid

from sqlalchemy import Boolean, Column, DateTime, Enum, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    OWNER = "owner"
    ACCOUNTANT = "accountant"
    STAFF = "staff"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    # Nullable because Google Sign-In users have no local password
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.OWNER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    business = relationship("Business", back_populates="owner_user", uselist=False)
