# app/groq_client.py
import os
from groq import AsyncGroq

# Initialize asynchronous Groq client
client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_transcript(topic: str, persona: str) -> str:
    """
    Generates a podcast-style transcript using Groq's chat completion API.
    """
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": f"You are {persona}, a lively podcast host."},
            {
                "role": "user",
                "content": f"Create a short podcast script about: {topic}",
            },
        ],
    )
    # Extract and return the assistant's reply
    return response.choices[0].message.content
