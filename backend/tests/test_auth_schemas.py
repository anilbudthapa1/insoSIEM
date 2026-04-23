import pytest
from pydantic import ValidationError

from app.core.security import hash_password, verify_password
from app.modules.auth.schemas import LoginRequest, PasswordResetRequest, RegisterRequest, UserInfo


def test_auth_schemas_accept_seeded_internal_email_domain() -> None:
    login = LoginRequest(email="admin@inso.local", password="Admin123!")
    reset = PasswordResetRequest(email="admin@inso.local")

    assert login.email == "admin@inso.local"
    assert reset.email == "admin@inso.local"


def test_auth_response_user_accepts_internal_email_domain() -> None:
    user = UserInfo(
        id="c0000000-0000-0000-0000-000000000001",
        email="admin@inso.local",
        full_name="System Administrator",
        org_id="a0000000-0000-0000-0000-000000000001",
        roles=["super_admin"],
    )

    assert user.email == "admin@inso.local"


def test_register_schema_rejects_malformed_email() -> None:
    with pytest.raises(ValidationError):
        RegisterRequest(
            organization_name="Inso",
            organization_slug="inso",
            full_name="System Administrator",
            username="admin",
            email="not-an-email",
            password="ChangeThisPassword123!",
        )


def test_security_helpers_verify_bcrypt_hashes_without_passlib_backend() -> None:
    hashed = hash_password("Admin123!")

    assert verify_password("Admin123!", hashed)
    assert not verify_password("WrongPassword123!", hashed)
