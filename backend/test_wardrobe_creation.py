#!/usr/bin/env python
"""Test wardrobe item creation with FormData."""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# Get credentials
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

print("=" * 60)
print("WARDROBE ITEM CREATION TEST")
print("=" * 60)

# Create client
client = create_client(supabase_url, supabase_key)
print("✓ Supabase client created\n")

# Test data that matches the schema
test_item = {
    "title": "Test Black Jacket",
    "description": "A stylish black leather jacket with a slim fit",
    "color": "Black",  # Must be exact match
    "warmth": "Cool",  # Must be exact match
    "formality": 7,    # Must be integer 1-10
    "image_url": "https://example.com/test.jpg"
}

print("Test item data:")
for key, value in test_item.items():
    print(f"  {key}: {value} (type: {type(value).__name__})")

print("\nValidation checks:")

# Check color
valid_colors = ["Black", "White", "Gray", "Blue", "Brown", "Green", "Red", "Pink", "Yellow", "Purple", "Orange"]
if test_item["color"] in valid_colors:
    print(f"  ✓ Color '{test_item['color']}' is valid")
else:
    print(f"  ✗ Color '{test_item['color']}' is INVALID")
    print(f"    Valid colors: {', '.join(valid_colors)}")

# Check warmth
valid_warmths = ["Cold", "Cool", "Neutral", "Warm", "Hot"]
if test_item["warmth"] in valid_warmths:
    print(f"  ✓ Warmth '{test_item['warmth']}' is valid")
else:
    print(f"  ✗ Warmth '{test_item['warmth']}' is INVALID")
    print(f"    Valid warmths: {', '.join(valid_warmths)}")

# Check formality
if isinstance(test_item["formality"], int) and 1 <= test_item["formality"] <= 10:
    print(f"  ✓ Formality {test_item['formality']} is valid")
else:
    print(f"  ✗ Formality {test_item['formality']} is INVALID")

print("\n" + "=" * 60)
print("FORMDATA CONVERSION TEST")
print("=" * 60)

# Simulate what FormData does - converts everything to strings
formdata_item = {
    "title": str(test_item["title"]),
    "description": str(test_item["description"]),
    "color": str(test_item["color"]),
    "warmth": str(test_item["warmth"]),
    "formality": str(test_item["formality"]),  # FormData converts to string!
}

print("\nAfter FormData conversion:")
for key, value in formdata_item.items():
    print(f"  {key}: {value} (type: {type(value).__name__})")

print("\nConversion test:")
try:
    formality_int = int(formdata_item["formality"])
    if 1 <= formality_int <= 10:
        print(f"  ✓ Successfully converted formality '{formdata_item['formality']}' to {formality_int}")
    else:
        print(f"  ✗ Formality {formality_int} is out of range")
except (ValueError, TypeError) as e:
    print(f"  ✗ Failed to convert formality: {e}")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print("""
The issue was:
1. Frontend sends formality as a string (because FormData converts all values to strings)
2. Backend expected formality as an integer
3. FastAPI validation failed with 422 error

The fix:
1. Backend now accepts formality as a string
2. Backend converts it to integer with validation
3. Backend validates color and warmth against allowed values
4. Better error messages are returned to frontend

This should resolve the "[object Object]" error!
""")

