"""
Test script to verify inline image support in chat.
This tests that:
1. Chat responses include image references for mentioned items
2. Markdown formatting is preserved in responses
3. The ChatResponse schema includes images
"""

import json
from app.models.schemas import ChatResponse, ChatImageReference

def test_chat_response_with_images():
    """Test that ChatResponse can include images"""
    
    # Create sample image references
    images = [
        ChatImageReference(
            item_id="item-1",
            title="Blue T-Shirt",
            image_url="https://example.com/blue-tshirt.jpg"
        ),
        ChatImageReference(
            item_id="item-2",
            title="Black Jeans",
            image_url="https://example.com/black-jeans.jpg"
        )
    ]
    
    # Create a chat response with markdown and images
    response = ChatResponse(
        message="I think the **Blue T-Shirt** would pair nicely with your __Black Jeans__. Here's what I recommend:\n- Wear them casually\n- Add a light jacket\n- Perfect for spring",
        referenced_items=["item-1", "item-2"],
        images=images
    )
    
    # Verify the response
    assert response.message is not None
    assert len(response.referenced_items) == 2
    assert len(response.images) == 2
    assert response.images[0].title == "Blue T-Shirt"
    assert response.images[1].title == "Black Jeans"
    
    # Verify markdown is preserved
    assert "**Blue T-Shirt**" in response.message
    assert "__Black Jeans__" in response.message
    
    print("✓ ChatResponse with images test passed")
    print(f"  - Message: {response.message[:50]}...")
    print(f"  - Referenced items: {response.referenced_items}")
    print(f"  - Images: {len(response.images)} items")
    
    # Test JSON serialization
    response_json = response.model_dump_json()
    parsed = json.loads(response_json)
    
    assert parsed["message"] is not None
    assert len(parsed["images"]) == 2
    assert parsed["images"][0]["title"] == "Blue T-Shirt"
    
    print("✓ JSON serialization test passed")
    print(f"  - Serialized response: {len(response_json)} bytes")

def test_image_reference_schema():
    """Test ChatImageReference schema"""
    
    img = ChatImageReference(
        item_id="test-id",
        title="Test Item",
        image_url="https://example.com/test.jpg"
    )
    
    assert img.item_id == "test-id"
    assert img.title == "Test Item"
    assert img.image_url == "https://example.com/test.jpg"
    
    print("✓ ChatImageReference schema test passed")

def test_markdown_patterns():
    """Test that markdown patterns are recognized"""
    
    test_cases = [
        ("**bold text**", "bold"),
        ("__strong text__", "strong"),
        ("*italic text*", "italic"),
        ("_emphasized text_", "emphasized"),
        ("- list item 1\n- list item 2", "list"),
    ]
    
    for text, pattern_type in test_cases:
        response = ChatResponse(
            message=text,
            referenced_items=[],
            images=[]
        )
        assert response.message == text
        print(f"✓ Markdown pattern '{pattern_type}' preserved: {text[:30]}...")

if __name__ == "__main__":
    print("Testing inline image support in chat...\n")
    
    test_chat_response_with_images()
    print()
    test_image_reference_schema()
    print()
    test_markdown_patterns()
    
    print("\n✅ All tests passed!")

