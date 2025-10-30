from fastapi import APIRouter, HTTPException, Header, File, UploadFile, Query
from typing import Optional
from app.models.schemas import WardrobeItem, WardrobeItemCreate, WardrobeItemUpdate
from app.services.supabase_service import supabase_service
from app.services.image_service import image_service
import uuid
from datetime import datetime

router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])

def get_user_id(authorization: str) -> str:
    """Helper function to extract and validate user ID from token."""
    token = authorization.replace("Bearer ", "")
    user_response = supabase_service.get_user(token)
    if not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_response.user.id

@router.get("/", response_model=list[WardrobeItem])
async def get_wardrobe(
    authorization: str = Header(...),
    color: Optional[str] = Query(None),
    warmth: Optional[str] = Query(None),
    formality_min: Optional[int] = Query(None, ge=1, le=10),
    formality_max: Optional[int] = Query(None, ge=1, le=10)
):
    """Get all wardrobe items for the authenticated user with optional filters."""
    user_id = get_user_id(authorization)

    items = supabase_service.get_wardrobe_items(
        user_id=user_id,
        color=color,
        warmth=warmth,
        formality_min=formality_min,
        formality_max=formality_max
    )

    return items

@router.post("/", response_model=WardrobeItem)
async def create_wardrobe_item(
    title: str,
    description: str,
    color: str,
    warmth: str,
    formality: int,
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    """
    Create a new wardrobe item with an image.
    This is called after the user confirms the scan preview.
    """
    user_id = get_user_id(authorization)

    # Check wardrobe limit (100 items)
    item_count = supabase_service.count_wardrobe_items(user_id)
    if item_count >= 100:
        raise HTTPException(
            status_code=400,
            detail="Wardrobe limit reached (100 items). Please delete some items first."
        )

    try:
        # Read and compress image
        image_data = await file.read()

        if not image_service.validate_image(image_data):
            raise HTTPException(status_code=400, detail="Invalid image file")

        compressed_image = image_service.compress_image(image_data)

        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        file_path = f"{user_id}/{uuid.uuid4()}.{file_extension}"

        # Upload to Supabase Storage
        image_url = supabase_service.upload_image(
            file_path=file_path,
            file_data=compressed_image,
            content_type=file.content_type or "image/jpeg"
        )

        # Create wardrobe item in database
        item_data = {
            "title": title,
            "description": description,
            "color": color,
            "warmth": warmth,
            "formality": formality,
            "image_url": image_url
        }

        created_item = supabase_service.create_wardrobe_item(user_id, item_data)

        if not created_item:
            raise HTTPException(status_code=500, detail="Failed to create wardrobe item")

        return created_item

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create item: {str(e)}")

@router.put("/{item_id}", response_model=WardrobeItem)
async def update_wardrobe_item(
    item_id: str,
    item_update: WardrobeItemUpdate,
    authorization: str = Header(...)
):
    """Update an existing wardrobe item's metadata (not the image)."""
    user_id = get_user_id(authorization)

    # Filter out None values
    update_data = {k: v for k, v in item_update.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated_item = supabase_service.update_wardrobe_item(item_id, user_id, update_data)

    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")

    return updated_item

@router.delete("/{item_id}")
async def delete_wardrobe_item(
    item_id: str,
    authorization: str = Header(...)
):
    """Delete a wardrobe item and its associated image."""
    user_id = get_user_id(authorization)

    deleted = supabase_service.delete_wardrobe_item(item_id, user_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")

    return {"message": "Item deleted successfully"}
