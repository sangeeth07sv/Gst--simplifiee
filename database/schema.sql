-- GST Genie — PostgreSQL schema
-- Built incrementally alongside frontend pages. This file currently covers
-- only what the Login/Signup/Forgot-Password page needs. Extend it (don't
-- replace it) as each new page/module is added — see comments below.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('owner', 'accountant', 'staff');

CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name         VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
    hashed_password   VARCHAR(255),          -- NULL for Google-only accounts
    google_id         VARCHAR(255) UNIQUE,
    role              user_role NOT NULL DEFAULT 'owner',
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- Minimal stub so login can check "does this user have a business yet".
-- Full columns (GSTIN, address, business_type, phone, etc.) will be added
-- via an ALTER TABLE migration when the Business Onboarding page is built,
-- rather than editing this CREATE TABLE after the fact.
CREATE TABLE businesses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id   UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NOTE (RBAC): businesses currently map 1:1 to an owner user. Accountant/
-- Staff roles collaborating on the SAME business will need a
-- `business_members (business_id, user_id, role)` join table — add this
-- when the Team/Settings page is built rather than assumed here.
