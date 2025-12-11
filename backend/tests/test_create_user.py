import pytest
from server.models.User import UserCreate
from server.database.Session import get_session
from server.crud.user import create_user

pytestmark = pytest.mark.asyncio

async def test_create_user_persists_and_hashes_password():
    payload = UserCreate(
        username="pytest_user",
        email="pytest_user@example.com",
        password="SuperSecret123!",
    )

    gen = get_session()
    session = next(gen)
    try:
        user = await create_user(payload, session)
        print("Created user:", user)

        # Basic persistence checks
        assert user.id is not None
        assert user.username == payload.username
        assert user.email == payload.email

        # Ensure password is hashed and not stored in plaintext
        assert hasattr(user, "hashed_password")
        assert user.hashed_password and user.hashed_password != payload.password
    finally:
        # close the generator-managed session
        try:
            next(gen)
        except StopIteration:
            pass



# poetry run pytest -q tests/test_create_user.py