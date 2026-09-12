import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
import uuid
from datetime import datetime

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_protected_endpoint_without_token():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401

def test_protected_endpoint_invalid_token():
    response = client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalidtoken"})
    assert response.status_code == 401

@patch("app.api.dependencies.verify_clerk_token")
@patch("app.services.user_service.UserService.get_user")
def test_users_me_requires_auth_and_works(mock_get_user, mock_verify):
    mock_verify.return_value = {"sub": "user_123"}
    mock_get_user.return_value = {
        "id": "00000000-0000-0000-0000-000000000000",
        "clerk_user_id": "user_123",
        "role": "buyer",
        "email": "test@test.com",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
    
    response = client.get("/api/v1/users/me", headers={"Authorization": "Bearer validtoken"})
    assert response.status_code == 200
    data = response.json()
    assert data["clerk_user_id"] == "user_123"

@patch("app.api.dependencies.verify_clerk_token")
@patch("app.services.user_service.UserService.sync_user")
def test_user_sync_endpoint(mock_sync_user, mock_verify):
    mock_verify.return_value = {"sub": "user_123"}
    mock_sync_user.return_value = {
        "id": "00000000-0000-0000-0000-000000000000",
        "clerk_user_id": "user_123",
        "role": "buyer",
        "email": "test@test.com",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
    
    # Sync first time
    response1 = client.post("/api/v1/users/sync", json={"email": "test@test.com"}, headers={"Authorization": "Bearer validtoken"})
    assert response1.status_code == 200
    
    # Sync second time (mimics idempotency)
    response2 = client.post("/api/v1/users/sync", json={"email": "test@test.com"}, headers={"Authorization": "Bearer validtoken"})
    assert response2.status_code == 200
    assert mock_sync_user.call_count == 2
