"""
Calls Groq (llama-3.3-70b-versatile) with col_schema + stats to produce structured insights.
"""
import json
from groq import Groq
from config import Config


def generate_insights(upload_id: str, col_schema: list, stats: dict) -> dict:
    client = Groq(api_key=Config.GROQ_API_KEY)
    prompt = _build_prompt(col_schema, stats)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )

    text = response.choices[0].message.content
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"summary": text, "top_performers": [], "anomalies": [], "trends": [], "recommendations": []}


def _build_prompt(col_schema: list, stats: dict) -> str:
    schema_str = json.dumps(col_schema, indent=2)
    stats_str = json.dumps(stats, indent=2)

    return f"""You are a senior sales analyst AI. Analyze the following sales dataset schema and statistics.

Column Schema:
{schema_str}

Column Statistics:
{stats_str}

Return a JSON object with exactly these keys:
- "summary": (string) 2-3 sentence overview of the dataset
- "top_performers": (array of strings) top 3-5 standout metrics or categories
- "anomalies": (array of strings) any unusual patterns or outliers
- "trends": (array of strings) key trends visible in the data
- "recommendations": (array of strings) 3-5 actionable business recommendations

Respond with ONLY valid JSON, no markdown, no extra text."""


def chat_with_data(query: str, col_schema: list, stats: dict, chat_history: list = None) -> str:
    client = Groq(api_key=Config.GROQ_API_KEY)

    schema_str = json.dumps(col_schema, indent=2)
    stats_str = json.dumps(stats, indent=2)

    messages = [
        {
            "role": "system",
            "content": (
                "You are InsightlyAI, a helpful sales intelligence assistant. "
                "You have access to the following data schema and statistics from the user's uploaded dataset:\n"
                f"Schema: {schema_str}\n"
                f"Stats: {stats_str}\n\n"
                "Answer the user's questions accurately based ONLY on this data. "
                "If the data doesn't contain information to answer the question, politely say so. "
                "Be concise, professional, and highlight key numbers where relevant. "
                "Use markdown for formatting if needed."
            )
        },
    ]

    if chat_history:
        messages.extend(chat_history)

    messages.append({"role": "user", "content": query})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.3,
    )

    return response.choices[0].message.content
