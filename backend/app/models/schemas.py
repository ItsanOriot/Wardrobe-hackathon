from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

# Wardrobe Item Models
ColorType = Literal["Black", "White", "Gray", "Blue", "Brown", "Green", "Red", "Pink", "Yellow", "Purple", "Orange"]
WarmthType = Literal["Cold", "Cool", "Neutral", "Warm", "Hot"]

class WardrobeItemCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    color: ColorType
    warmth: WarmthType
    formality: int = Field(..., ge=1, le=10)
    image_url: str

class WardrobeItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=1, max_length=500)
    color: Optional[ColorType] = None
    warmth: Optional[WarmthType] = None
    formality: Optional[int] = Field(None, ge=1, le=10)

class WardrobeItem(WardrobeItemCreate):
    id: str
    user_id: str
    created_at: datetime

# Scan Models
class ScanResponse(BaseModel):
    title: str
    description: str
    color: ColorType
    warmth: WarmthType
    formality: int

# Auth Models
class UserSignup(BaseModel):
    email: str
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user_id: str

# Chat Models
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class ChatImageReference(BaseModel):
    item_id: str
    title: str
    image_url: str

class ChatResponse(BaseModel):
    message: str
    referenced_items: list[str] = []  # Item IDs referenced in response
    images: list[ChatImageReference] = []  # Images of referenced items
