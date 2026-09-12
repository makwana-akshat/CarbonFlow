# Phase 13: Advanced AI Features

This phase introduces non-deterministic AI capabilities to CarbonFlow while maintaining the platform's deterministic sources of truth.

## Implemented Features

### 1. Unified LLM Provider
- Added `app/ai/provider.py` which abstracts calls to the LLM (OpenAI SDK is used).
- If `LLM_API_KEY` is not provided in `.env`, the system safely falls back to deterministic static outputs without breaking the platform.

### 2. AI Business Insights (Dashboard)
- Replaced the hardcoded strings in `DashboardService.get_ai_insight` with an LLM call.
- The service gathers the deterministic total active supply and demand, and passes them to the LLM using a strict JSON schema prompt to generate an insightful B2B overview.

### 3. Natural Language Chatbot (Assistant)
- Created `POST /api/v1/ai/chat` endpoint.
- Context injection: The backend fetches the user's latest KPIs, alerts, and active orders via existing deterministic services (`DashboardService`) and injects them into the system prompt.
- Connected the React frontend (`AssistantDialog.tsx`) to the real backend, removing the hardcoded `generateMockResponse` logic.
- Maintained the visual Siri-style Orb states (`listening`, `thinking`, `speaking`, `idle`).

## Skipped Features
As per instructions, only features that already had corresponding UI representations were implemented. The following were skipped because they lack frontend implementations:
- AI-enhanced Recommendation Explanations
- AI-generated Smart Contracts (Drafting UI is missing)
- WhatsApp Integrations

## Security & Guardrails
- **Fact-grounding**: System prompts explicitly instruct the AI to rely *only* on the provided JSON context and never hallucinate quantities or prices.
- **SQL Injection**: AI has no access to the database directly; it only reads Pydantic outputs from existing deterministic repository methods.
