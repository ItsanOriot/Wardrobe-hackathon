#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Check Supabase configuration."""
import os
import json
import sys
from dotenv import load_dotenv
import requests

# Fix encoding for Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

print("=" * 60)
print("SUPABASE CONFIGURATION CHECK")
print("=" * 60)

print(f"\n✓ Supabase URL: {supabase_url}")
print(f"✓ Service Key: {supabase_key[:30]}...")

# Extract project ID from URL
project_id = supabase_url.split("//")[1].split(".")[0]
print(f"✓ Project ID: {project_id}")

# Try to get auth config via REST API
print("\n" + "=" * 60)
print("CHECKING AUTH CONFIGURATION")
print("=" * 60)

try:
    # Get auth config
    headers = {
        "Authorization": f"Bearer {supabase_key}",
        "apikey": supabase_key,
        "Content-Type": "application/json"
    }

    # Try to list users to verify connection
    response = requests.get(
        f"{supabase_url}/rest/v1/auth.users",
        headers=headers
    )
    
    if response.status_code == 200:
        users = response.json()
        print(f"\n✓ Successfully connected to Supabase")
        print(f"✓ Total users: {len(users)}")
        
        for user in users:
            print(f"\n  User: {user.get('email')}")
            print(f"  - ID: {user.get('id')}")
            print(f"  - Confirmed: {user.get('email_confirmed_at') is not None}")
            print(f"  - Created: {user.get('created_at')}")
    else:
        print(f"\n✗ Failed to get users: {response.status_code}")
        print(f"  Response: {response.text}")
        
except Exception as e:
    print(f"\n✗ Error: {e}")

print("\n" + "=" * 60)
print("RECOMMENDATIONS")
print("=" * 60)

print("""
1. If you see users listed above:
   - Check if "Confirmed" is True or False
   - If False, email confirmation is enabled
   - Go to Supabase → Authentication → Providers → Email
   - Turn OFF "Confirm email" toggle

2. If you see no users:
   - Try signing up again
   - Then run this script again

3. If connection fails:
   - Check your SUPABASE_URL and SUPABASE_SERVICE_KEY
   - Make sure they're correct in backend/.env
""")

print("=" * 60)

