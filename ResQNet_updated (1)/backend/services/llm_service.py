"""
Thin wrapper around the Groq-hosted LLM (openai/gpt-oss-120b) used by
all agents in the LangGraph workflow.
"""
import json
import re
from langchain_groq import ChatGroq
from config.settings import settings

_llm = None


def get_llm(temperature: float = 0.3) -> ChatGroq:
    """Return a cached ChatGroq client instance."""
    global _llm
    if _llm is None:
        if not settings.GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env"
            )
        _llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=settings.GROQ_MODEL,
            temperature=temperature,
        )
    return _llm


def extract_json(text: str) -> dict:
    """Extract the first valid JSON object from an LLM response string."""
    text = text.strip()
    text = re.sub(r"^```(json)?", "", text.strip())
    text = re.sub(r"```$", "", text.strip())
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON object found in LLM output: {text[:200]}")
    return json.loads(match.group(0))


def call_llm_json(system_prompt: str, user_prompt: str) -> dict:
    """Call the LLM and parse its response as JSON, with a safe fallback."""
    llm = get_llm()
    messages = [
        ("system", system_prompt),
        ("human", user_prompt),
    ]
    response = llm.invoke(messages)
    content = response.content
    try:
        return extract_json(content)
    except Exception:
        return {"raw_response": content}
