from fastapi import APIRouter, File, UploadFile, HTTPException, Header
from app.models.schemas import ScanResponse
from app.services.openai_service import openai_service
from app.services.image_service import image_service
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/scan", tags=["scanner"])

@router.post("/", response_model=ScanResponse)
async def scan_clothing(
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    """
    Upload a clothing image and extract metadata using GPT-4o Vision.
    Returns the extracted characteristics for preview before saving.
    """
    try:
        # Verify user authentication
        token = authorization.replace("Bearer ", "")
        user_response = supabase_service.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Read image data
        image_data = await file.read()

        # Validate image
        if not image_service.validate_image(image_data):
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Compress image
        compressed_image = image_service.compress_image(image_data)

        # Analyze image with GPT-4o Vision
        scan_result = openai_service.scan_clothing_image(compressed_image)

        # Validate the response has required fields
        required_fields = ["title", "description", "color", "warmth", "formality"]
        for field in required_fields:
            if field not in scan_result:
                raise HTTPException(
                    status_code=500,
                    detail=f"AI response missing required field: {field}"
                )

        return ScanResponse(**scan_result)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")
