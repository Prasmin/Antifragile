import pytest
import asyncio
from server.models.User import UserCreate
from server.crud.user import create_user
from server.database.Session import SessionDep

@pytest.mark.asyncio
async def main():
    payload = UserCreate(username="tester", email="tester@example.com", password="Secret123!")
    gen = SessionDep
    session = next(gen)
    try:
        created = await create_user(payload, session)
        print("Created user:", created)
    finally:
        try:
            next(gen)  # close the session context
        except StopIteration:
            pass

if __name__ == "__main__":
    asyncio.run(main())