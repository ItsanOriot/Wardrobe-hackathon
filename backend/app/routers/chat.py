from fastapi import APIRouter, HTTPException, Header
from app.models.schemas import ChatRequest, ChatResponse, ChatImageReference
from app.services.openai_service import openai_service
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/chat", tags=["chat"])

def get_user_id(authorization: str) -> str:
    """Helper function to extract and validate user ID from token."""
    token = authorization.replace("Bearer ", "")
    user_response = supabase_service.get_user(token)
    if not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_response.user.id

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    authorization: str = Header(...)
):
    """
    Send a message to the AI stylist.
    The AI is provided with the user's wardrobe and chat history as context.
    """
    user_id = get_user_id(authorization)

    try:
        # Get user's wardrobe items
        wardrobe_items = supabase_service.get_wardrobe_items(user_id)

        # Get AI response
        ai_response = openai_service.chat_with_stylist(
            user_message=request.message,
            chat_history=[msg.model_dump() for msg in request.history],
            wardrobe_items=wardrobe_items
        )

        # Extract any item IDs and titles referenced in the response
        referenced_items = []
        images = []

        for item in wardrobe_items:
            # Check if item title or ID is mentioned in the response
            if item['title'].lower() in ai_response.lower() or item['id'] in ai_response:
                referenced_items.append(item['id'])
                # Add image reference
                images.append(ChatImageReference(
                    item_id=item['id'],
                    title=item['title'],
                    image_url=item['image_url']
                ))

        return ChatResponse(
            message=ai_response,
            referenced_items=referenced_items,
            images=images
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
