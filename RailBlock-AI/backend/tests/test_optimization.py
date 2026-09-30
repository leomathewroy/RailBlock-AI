import pytest

@pytest.mark.asyncio
async def test_optimization_run(client):
    response = await client.post("/api/optimization/run", json={
        "zone": "NR",
        "time_horizon_hours": 24,
        "maintenance_tasks": [
            {"track_section_code": "NDLS-PWL", "duration_hours": 2.0, "priority": "High"},
            {"track_section_code": "PWL-MTJ", "duration_hours": 2.5, "priority": "Medium"}
        ]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["solver_status"] in ("OPTIMAL", "FEASIBLE")
    assert "scheduled_blocks" in data
    assert len(data["scheduled_blocks"]) == 2
