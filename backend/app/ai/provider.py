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
            client_kwargs = {"api_key": self.api_key}
            if hasattr(settings, 'LLM_BASE_URL') and settings.LLM_BASE_URL:
                client_kwargs["base_url"] = settings.LLM_BASE_URL
            else:
                client_kwargs["base_url"] = "https://api.groq.com/openai/v1"
            
            self.client = openai.Client(**client_kwargs)
            self.model = settings.LLM_MODEL or "qwen/qwen3.8-27b"

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
            
    def chat(
        self,
        messages: list,
        tools: Optional[list] = None,
        response_schema: Optional[Type[BaseModel]] = None,
        max_tokens: int = 800,
        temperature: float = 0.2
    ) -> Any:
        if not self.is_available():
            raise Exception("AI service is currently unavailable. (Missing API key)")
        
        try:
            kwargs = {
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature
            }
            if tools:
                kwargs["tools"] = tools
                
            if response_schema:
                kwargs["response_format"] = {"type": "json_object"}
                # ensure schema instruction is in system prompt (assumed first message)
                schema_instructions = f"\n\nYou MUST return a valid JSON object adhering strictly to this schema: {response_schema.model_json_schema()}"
                if messages and messages[0]["role"] == "system":
                    messages[0]["content"] += schema_instructions
                    
            response = self.client.chat.completions.create(**kwargs)
            message = response.choices[0].message
            
            # If the model called a tool, return the whole message object so orchestrator can handle it
            if message.tool_calls:
                return message
                
            content = message.content
            
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
