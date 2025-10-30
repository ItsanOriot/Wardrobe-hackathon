import os
from supabase import create_client, Client
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class SupabaseService:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")

        self.client: Client = create_client(supabase_url, supabase_key)
        self.storage_bucket = "wardrobe-images"

    # Auth methods
    def sign_up(self, email: str, password: str):
        """Create a new user account."""
        response = self.client.auth.sign_up({
            "email": email,
            "password": password
        })
        return response

    def sign_in(self, email: str, password: str):
        """Sign in an existing user."""
        response = self.client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response

    def get_user(self, access_token: str):
        """Get user information from access token."""
        response = self.client.auth.get_user(access_token)
        return response

    # Wardrobe methods
    def get_wardrobe_items(self, user_id: str, color: Optional[str] = None,
                          warmth: Optional[str] = None,
                          formality_min: Optional[int] = None,
                          formality_max: Optional[int] = None):
        """Get all wardrobe items for a user with optional filters."""
        query = self.client.table("wardrobe_items").select("*").eq("user_id", user_id)

        if color:
            query = query.eq("color", color)
        if warmth:
            query = query.eq("warmth", warmth)
        if formality_min is not None:
            query = query.gte("formality", formality_min)
        if formality_max is not None:
            query = query.lte("formality", formality_max)

        response = query.order("created_at", desc=True).execute()
        return response.data

    def count_wardrobe_items(self, user_id: str) -> int:
        """Count total wardrobe items for a user."""
        response = self.client.table("wardrobe_items").select("id", count="exact").eq("user_id", user_id).execute()
        return response.count

    def create_wardrobe_item(self, user_id: str, item_data: dict):
        """Create a new wardrobe item."""
        data = {
            **item_data,
            "user_id": user_id
        }
        response = self.client.table("wardrobe_items").insert(data).execute()
        return response.data[0] if response.data else None

    def update_wardrobe_item(self, item_id: str, user_id: str, update_data: dict):
        """Update an existing wardrobe item."""
        response = self.client.table("wardrobe_items") \
            .update(update_data) \
            .eq("id", item_id) \
            .eq("user_id", user_id) \
            .execute()
        return response.data[0] if response.data else None

    def delete_wardrobe_item(self, item_id: str, user_id: str):
        """Delete a wardrobe item."""
        # First get the item to retrieve image_url
        item_response = self.client.table("wardrobe_items") \
            .select("image_url") \
            .eq("id", item_id) \
            .eq("user_id", user_id) \
            .execute()

        if not item_response.data:
            return None

        image_url = item_response.data[0]["image_url"]

        # Delete from database
        delete_response = self.client.table("wardrobe_items") \
            .delete() \
            .eq("id", item_id) \
            .eq("user_id", user_id) \
            .execute()

        # Delete from storage if image exists
        if image_url:
            file_path = image_url.split(f"{self.storage_bucket}/")[-1]
            self.client.storage.from_(self.storage_bucket).remove([file_path])

        return delete_response.data

    # Storage methods
    def upload_image(self, file_path: str, file_data: bytes, content_type: str = "image/jpeg"):
        """Upload an image to Supabase storage."""
        response = self.client.storage.from_(self.storage_bucket).upload(
            file_path,
            file_data,
            {"content-type": content_type}
        )

        # Get public URL
        public_url = self.client.storage.from_(self.storage_bucket).get_public_url(file_path)
        return public_url

    def delete_image(self, file_path: str):
        """Delete an image from Supabase storage."""
        response = self.client.storage.from_(self.storage_bucket).remove([file_path])
        return response

# Singleton instance
supabase_service = SupabaseService()
