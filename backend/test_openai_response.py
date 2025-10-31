#!/usr/bin/env python
"""Test what OpenAI actually returns for clothing analysis."""
import os
import sys
from dotenv import load_dotenv
from app.services.openai_service import openai_service
from app.services.image_service import image_service
from PIL import Image
import io
import json

load_dotenv()

print("=" * 70)
print("TESTING OPENAI RESPONSE FORMAT")
print("=" * 70)

# Create a simple test image (red square)
print("\n1. Creating test image...")
img = Image.new('RGB', (200, 200), color='red')
img_bytes = io.BytesIO()
img.save(img_bytes, format='JPEG')
img_bytes.seek(0)
image_data = img_bytes.read()
print(f"   ✓ Created {len(image_data)} bytes image")

# Test the scan
print("\n2. Calling OpenAI scan_clothing_image()...")
try:
    result = openai_service.scan_clothing_image(image_data)
    print("   ✓ Got response from OpenAI")
    
    print("\n3. Response content:")
    print(json.dumps(result, indent=2))
    
    print("\n4. Field analysis:")
    for key, value in result.items():
        print(f"   {key}: {value!r}")
        print(f"      Type: {type(value).__name__}")
        if key == "color":
            valid_colors = ["Black", "White", "Gray", "Blue", "Brown", "Green", "Red", "Pink", "Yellow", "Purple", "Orange"]
            if value in valid_colors:
                print(f"      ✓ Valid color")
            else:
                print(f"      ✗ INVALID color! Valid: {valid_colors}")
        elif key == "warmth":
            valid_warmths = ["Cold", "Cool", "Neutral", "Warm", "Hot"]
            if value in valid_warmths:
                print(f"      ✓ Valid warmth")
            else:
                print(f"      ✗ INVALID warmth! Valid: {valid_warmths}")
        elif key == "formality":
            if isinstance(value, int) and 1 <= value <= 10:
                print(f"      ✓ Valid formality")
            else:
                print(f"      ✗ INVALID formality! Must be int 1-10")
    
    print("\n5. Validation summary:")
    valid_colors = ["Black", "White", "Gray", "Blue", "Brown", "Green", "Red", "Pink", "Yellow", "Purple", "Orange"]
    valid_warmths = ["Cold", "Cool", "Neutral", "Warm", "Hot"]
    
    all_valid = True
    if result.get("color") not in valid_colors:
        print(f"   ✗ Color '{result.get('color')}' is not in allowed list")
        all_valid = False
    if result.get("warmth") not in valid_warmths:
        print(f"   ✗ Warmth '{result.get('warmth')}' is not in allowed list")
        all_valid = False
    if not isinstance(result.get("formality"), int) or not (1 <= result.get("formality") <= 10):
        print(f"   ✗ Formality '{result.get('formality')}' is not valid")
        all_valid = False
    
    if all_valid:
        print("   ✓ All fields are valid!")
    else:
        print("   ✗ Some fields are invalid - this would cause 422 error")
        
except Exception as e:
    print(f"   ✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)

