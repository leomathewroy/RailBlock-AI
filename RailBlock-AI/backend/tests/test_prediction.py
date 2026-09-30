import pytest

@pytest.mark.asyncio
async def test_delay_prediction(client):
    response = await client.post("/api/predictions/delay", json={
        "train_number": "12301",
        "station_code": "NDLS",
        "scheduled_hour": 16,
        "day_of_week": 2,
        "month": 9,
        "distance_km": 1450.0,
        "train_type": "Rajdhani"
    })
    assert response.status_code == 200
    data = response.json()
    assert "predicted_delay_minutes" in data
    assert data["predicted_delay_minutes"] >= 0.0
    assert "confidence_score" in data
    assert data["data_source"] == "predicted"

@pytest.mark.asyncio
async def test_asset_risk_prediction(client):
    response = await client.post("/api/predictions/asset-risk", json={
        "asset_code": "WAP7-30201",
        "asset_type": "Locomotive",
        "utilization_rate": 88.0,
        "days_since_maintenance": 45,
        "health_score": 82.0
    })
    assert response.status_code == 200
    data = response.json()
    assert "failure_risk_probability" in data
    assert 0.0 <= data["failure_risk_probability"] <= 1.0
