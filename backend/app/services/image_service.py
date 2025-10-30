from PIL import Image
from io import BytesIO

class ImageService:
    MAX_SIZE_BYTES = 2 * 1024 * 1024  # 2MB
    MAX_DIMENSION = 1920  # Max width or height

    @staticmethod
    def compress_image(image_data: bytes, max_size_bytes: int = MAX_SIZE_BYTES) -> bytes:
        """
        Compress an image to be under max_size_bytes while maintaining quality.

        Args:
            image_data: Original image bytes
            max_size_bytes: Maximum file size in bytes (default 2MB)

        Returns:
            Compressed image bytes
        """
        # Open image
        img = Image.open(BytesIO(image_data))

        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background

        # Resize if too large
        max_dim = ImageService.MAX_DIMENSION
        if img.width > max_dim or img.height > max_dim:
            img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

        # Compress with progressively lower quality until under size limit
        quality = 95
        output = BytesIO()

        while quality > 20:
            output.seek(0)
            output.truncate()
            img.save(output, format='JPEG', quality=quality, optimize=True)

            if output.tell() <= max_size_bytes:
                break

            quality -= 5

        return output.getvalue()

    @staticmethod
    def validate_image(image_data: bytes) -> bool:
        """
        Validate that the data is a valid image.

        Returns:
            True if valid image, False otherwise
        """
        try:
            img = Image.open(BytesIO(image_data))
            img.verify()
            return True
        except Exception:
            return False

# Singleton instance
image_service = ImageService()
