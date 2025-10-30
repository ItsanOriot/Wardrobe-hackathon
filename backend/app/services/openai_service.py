import os
import json
import base64
from openai import OpenAI
from dotenv import load_dotenv
from app.prompts import SCANNER_VISION_PROMPT, STYLIST_SYSTEM_PROMPT, format_wardrobe_context

load_dotenv()

class OpenAIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("Missing OPENAI_API_KEY environment variable")

        self.client = OpenAI(api_key=api_key)
        self.vision_model = "gpt-4o"
        self.chat_model = "gpt-4o"

    def scan_clothing_image(self, image_data: bytes) -> dict:
        """
        Use GPT-4o Vision to analyze a clothing image and extract metadata.

        Returns a dict with: title, description, color, warmth, formality
        """
        # Encode image to base64
        base64_image = base64.b64encode(image_data).decode('utf-8')

        response = self.client.chat.completions.create(
            model=self.vision_model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": SCANNER_VISION_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500,
            temperature=0.3,  # Lower temperature for more consistent output
        )

        # Parse the JSON response
        content = response.choices[0].message.content

        try:
            # Try to extract JSON from markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            result = json.loads(content)
            return result
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response as JSON: {content}") from e

    def chat_with_stylist(self, user_message: str, chat_history: list, wardrobe_items: list) -> str:
        """
        Chat with the AI stylist, providing wardrobe context.

        Args:
            user_message: The user's current message
            chat_history: List of previous messages [{role: "user"/"assistant", content: "..."}]
            wardrobe_items: List of user's wardrobe items

        Returns:
            The AI stylist's response
        """
        # Format wardrobe context
        wardrobe_context = format_wardrobe_context(wardrobe_items)

        # Build system message with wardrobe context
        system_message = STYLIST_SYSTEM_PROMPT + wardrobe_context

        # Build messages array
        messages = [{"role": "system", "content": system_message}]

        # Add chat history
        for msg in chat_history:
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Call OpenAI API
        response = self.client.chat.completions.create(
            model=self.chat_model,
            messages=messages,
            max_tokens=1000,
            temperature=0.7,  # Balanced creativity for styling advice
        )

        return response.choices[0].message.content

# Singleton instance
openai_service = OpenAIService()
