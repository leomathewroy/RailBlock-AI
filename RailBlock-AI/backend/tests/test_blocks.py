import pytest

@pytest.mark.asyncio
async def test_generate_block_plan(client):
    response = await client.post("/api/block-plans/generate", json={
        "plan_date": "2026-09-28",
        "zone": "NR",
        "time_horizon_hours": 24,
        "max_concurrent_blocks": 3
    })
    assert response.status_code == 200
    data = response.json()
    assert "plan_code" in data
    assert "items" in data
    assert data["solver_status"] in ("OPTIMAL", "FEASIBLE")

@pytest.mark.asyncio
async def test_what_if_analysis(client):
    response = await client.post("/api/block-plans/what-if", json={
        "block_duration_factor": 1.2,
        "track_availability_percentage": 90.0,
        "train_priority_bias": 1.1
    })
    assert response.status_code == 200
    data = response.json()
    assert "estimated_delay_reduction_pct" in data
    assert "asset_availability_score" in data
