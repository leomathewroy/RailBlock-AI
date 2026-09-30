import pytest

@pytest.mark.asyncio
async def test_get_trains(client):
    response = await client.get("/api/trains?page=1&size=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) > 0

@pytest.mark.asyncio
async def test_get_stations(client):
    response = await client.get("/api/stations?page=1&size=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) > 0

@pytest.mark.asyncio
async def test_get_track_sections(client):
    response = await client.get("/api/track-sections")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
