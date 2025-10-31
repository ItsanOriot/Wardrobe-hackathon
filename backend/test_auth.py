#!/usr/bin/env python
"""Test authentication with Supabase."""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# Get credentials
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

print(f"Supabase URL: {supabase_url}")
print(f"Service Key: {supabase_key[:30]}...")

# Create client
client = create_client(supabase_url, supabase_key)
print("✓ Client created successfully\n")

# Test email
test_email = "test@example.com"
test_password = "TestPassword123!"

print(f"Testing with email: {test_email}")
print(f"Testing with password: {test_password}\n")

# Try to sign up
print("1. Attempting signup...")
try:
    signup_response = client.auth.sign_up({
        "email": test_email,
        "password": test_password
    })
    print(f"   Signup response user: {signup_response.user}")
    print(f"   Signup response session: {signup_response.session}")
    if signup_response.session:
        print(f"   Access token: {signup_response.session.access_token[:30]}...")
    print("   ✓ Signup successful\n")
except Exception as e:
    print(f"   ✗ Signup failed: {e}\n")

# Try to sign in
print("2. Attempting login...")
try:
    login_response = client.auth.sign_in_with_password({
        "email": test_email,
        "password": test_password
    })
    print(f"   Login response user: {login_response.user}")
    print(f"   Login response session: {login_response.session}")
    if login_response.session:
        print(f"   Access token: {login_response.session.access_token[:30]}...")
    print("   ✓ Login successful\n")
except Exception as e:
    print(f"   ✗ Login failed: {e}\n")

# Check Supabase settings
print("3. Checking Supabase auth settings...")
try:
    # Get auth config
    response = client.auth.get_session()
    print(f"   Current session: {response}")
except Exception as e:
    print(f"   Note: {e}")

print("\nDone!")

