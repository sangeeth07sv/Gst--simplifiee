import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Business(Base):
    """
    NOTE: This is a minimal stub so the login flow can check `has_business`.
    Full fields (GSTIN, address, business type, etc.) and the
    business_members join table for Accountant/Staff RBAC across a shared
    business will be added when the Business Onboarding page is built.
    """

    __tablename__ = "businesses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner_user = relationship("User", back_populates="business")
