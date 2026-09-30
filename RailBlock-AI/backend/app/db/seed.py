import asyncio
from sqlalchemy import select
from app.db.database import async_session_maker
from app.models.user import User
from app.core.security import get_password_hash

async def seed_db():
    async with async_session_maker() as session:
        # Check if user exists
        stmt = select(User).where(User.email == "admin@railblock.ai")
        result = await session.execute(stmt)
        admin = result.scalar_one_or_none()
        
        if not admin:
            admin = User(
                email="admin@railblock.ai",
                hashed_password=get_password_hash("admin"),
                full_name="Admin User",
                is_active=True,
                is_superuser=True
            )
            session.add(admin)
            await session.commit()
            print("Seed user created.")
        else:
            print("Seed user already exists.")

if __name__ == "__main__":
    asyncio.run(seed_db())
