import json
import logging
from typing import Dict, Any, Optional
import redis
from datetime import datetime, timedelta
from app.core.config import settings

logger = logging.getLogger(__name__)

class ChatSessionManager:
    """
    Manages short-term conversation state for the chatbot.
    Attempts to use Redis, but falls back to an in-memory dictionary if Redis is unavailable.
    """
    def __init__(self, redis_url: str = "redis://localhost:6379/0", ttl_minutes: int = 30):
        self.ttl_minutes = ttl_minutes
        self.use_redis = False
        self.redis_client = None
        self._memory_fallback: Dict[str, Dict[str, Any]] = {}
        
        try:
            # Check if REDIS_URL exists in settings, else fallback
            url = getattr(settings, "REDIS_URL", redis_url)
            self.redis_client = redis.Redis.from_url(url, decode_responses=True)
            self.redis_client.ping()
            self.use_redis = True
            logger.info("ChatSessionManager initialized using Redis.")
        except Exception as e:
            # Downgraded to debug to avoid spamming the console when running locally without Redis
            logger.debug(f"Failed to connect to Redis. Falling back to in-memory dict. {e}")
            self.use_redis = False

    def _get_key(self, session_id: str) -> str:
        return f"chat:session:{session_id}"

    def get_session(self, session_id: str) -> Dict[str, Any]:
        key = self._get_key(session_id)
        if self.use_redis:
            try:
                data = self.redis_client.get(key)
                if data:
                    return json.loads(data)
                return self._default_session(session_id)
            except Exception as e:
                logger.error(f"Redis get error: {e}")
                return self._default_session(session_id)
        else:
            session = self._memory_fallback.get(key)
            if session:
                # check expiration for fallback memory
                expires_at = datetime.fromisoformat(session["expires_at"])
                if datetime.now() > expires_at:
                    del self._memory_fallback[key]
                    return self._default_session(session_id)
                return session
            return self._default_session(session_id)

    def save_session(self, session_id: str, session_data: Dict[str, Any]) -> None:
        key = self._get_key(session_id)
        session_data["updated_at"] = datetime.now().isoformat()
        session_data["expires_at"] = (datetime.now() + timedelta(minutes=self.ttl_minutes)).isoformat()
        
        if self.use_redis:
            try:
                self.redis_client.setex(
                    key, 
                    timedelta(minutes=self.ttl_minutes), 
                    json.dumps(session_data)
                )
            except Exception as e:
                logger.error(f"Redis set error: {e}")
        else:
            self._memory_fallback[key] = session_data

    def _default_session(self, session_id: str) -> Dict[str, Any]:
        now = datetime.now()
        return {
            "session_id": session_id,
            "user_id": None,
            "language": "en",
            "current_intent": "UNKNOWN",
            "current_requirement_id": None,
            "current_parameters": {},
            "missing_parameters": [],
            "last_result_id": None,
            "last_supplier_ids": [],
            "last_search_results": [],
            "last_match_ids": [],
            "selected_supplier_id": None,
            "selected_supplier_name": None,
            "selected_match_id": None,
            "selected_quantity_tonnes": None,
            "selected_price_per_tonne": None,
            "selected_delivery_location": None,
            "selected_route_id": None,
            "pending_action": None,
            "pending_action_parameters": None,
            "requires_confirmation": False,
            "last_action": None,
            "last_tool": None,
            "last_tool_result": None,
            "last_order_id": None,
            "last_idempotency_key": None,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "expires_at": (now + timedelta(minutes=self.ttl_minutes)).isoformat()
        }
