from openai import OpenAI
from app.config import get_settings
from app.agent.prompts import SYSTEM_PROMPT


class LLMUnavailable(RuntimeError):
    pass


def generate_answer(message: str, memories: list[dict], product: str | None = None, version: str | None = None) -> str:
    settings = get_settings()
    if not settings.llm_api_key:
        raise LLMUnavailable("The language model is not configured")
    try:
        client = OpenAI(api_key=settings.llm_api_key, base_url=settings.llm_base_url, timeout=30.0)
        memory_text = "\n".join(f"- {item['text']}" for item in memories) or "No relevant team memories were retrieved."
        response = client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Product: {product or 'unspecified'}\nVersion: {version or 'unspecified'}\nQuestion: {message}\n\nRetrieved memory evidence (historical/team knowledge):\n{memory_text}"},
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
