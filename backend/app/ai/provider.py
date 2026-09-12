import json
from typing import Dict, Any, Optional, Type
from pydantic import BaseModel
import openai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class LLMProvider:
    def __init__(self):
        self.api_key = settings.LLM_API_KEY
        if not self.api_key:
            logger.warning("LLM_API_KEY is not set. AI features will fallback to default responses.")
        else:
            self.client = openai.Client(api_key=self.api_key)
            self.model = settings.LLM_MODEL or "gpt-4o-mini"

    def is_available(self) -> bool:
        return bool(self.api_key)

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
        max_tokens: int = 500,
        temperature: float = 0.2
    ) -> Any:
        if not self.is_available():
            raise Exception("AI service is currently unavailable. (Missing API key)")
        
        try:
            kwargs = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": max_tokens,
                "temperature": temperature
            }
            
            if response_schema:
                # Use JSON schema response format natively if available, or just instruct
                kwargs["response_format"] = {"type": "json_object"}
                # Add instructions to the system prompt
                schema_instructions = f"\n\nYou MUST return a valid JSON object adhering strictly to this schema: {response_schema.model_json_schema()}"
                kwargs["messages"][0]["content"] += schema_instructions
                
            response = self.client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            
            if response_schema:
                try:
                    return response_schema.model_validate_json(content)
                except Exception as e:
                    logger.error(f"Failed to parse LLM structured output: {e}")
                    raise Exception("AI generated malformed response.")
            
            return content
        except Exception as e:
            logger.error(f"LLM Generation Error: {str(e)}")
            raise Exception(f"AI generation failed: {str(e)}")
