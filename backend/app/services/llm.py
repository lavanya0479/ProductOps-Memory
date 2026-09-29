from openai import OpenAI
import httpx
from app.config import get_settings
from app.agent.prompts import SYSTEM_PROMPT


class LLMUnavailable(RuntimeError):
    pass


def generate_answer(message: str, memories: list[dict], product: str | None = None, version: str | None = None) -> str:
    settings = get_settings()
    memory_text = "\n".join(f"- {item['text']}" for item in memories) or "No relevant team memories were retrieved."
    user_message = f"Product: {product or 'unspecified'}\nVersion: {version or 'unspecified'}\nQuestion: {message}\n\nRetrieved memory evidence (historical/team knowledge):\n{memory_text}"

    if settings.llm_provider.lower() == "ollama":
        try:
            response = httpx.post(
                f"{settings.ollama_base_url.rstrip('/')}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    "stream": False,
                    "options": {"temperature": 0.2},
                },
                timeout=httpx.Timeout(settings.ollama_timeout_seconds, connect=3.0),
            )
            response.raise_for_status()
            answer = response.json().get("message", {}).get("content", "").strip()
            if not answer:
                raise LLMUnavailable("The local model returned an empty answer")
            return answer
        except LLMUnavailable:
            raise
        except Exception as exc:
            raise LLMUnavailable("The local Ollama model is unavailable") from exc

    if not settings.llm_api_key:
        raise LLMUnavailable("The language model is not configured")
    try:
        client = OpenAI(api_key=settings.llm_api_key, base_url=settings.llm_base_url, timeout=25.0, max_retries=0)
        response = client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        )
        answer = response.choices[0].message.content
        if not answer:
            raise LLMUnavailable("The language model returned an empty answer")
        return answer
    except LLMUnavailable:
        raise
    except Exception as exc:
        raise LLMUnavailable("The language model is temporarily unavailable") from exc
