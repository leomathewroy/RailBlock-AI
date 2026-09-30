import pytest
from app.core.config import settings

@pytest.mark.asyncio
async def test_login_demo_user(client):
    response = await client.post("/api/auth/login", json={
        "username": settings.DEMO_USERNAME,
        "password": settings.DEMO_PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == settings.DEMO_USERNAME

@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post("/api/auth/login", json={
        "username": "wrong_user",
        "password": "wrong_password"
    })
    assert response.status_code == 401
