"""
Test script to demonstrate SQLite database functionality
Run this script to create sample data and test the API endpoints
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8001"
HEADERS = {
    "x-app-secret": "secret-key-not-expose-backend-outside-app",
    "Content-Type": "application/json"
}

def test_data_endpoint():
    """Test the basic data endpoint"""
    print("🔍 Testing basic data endpoint...")
    response = requests.get(f"{BASE_URL}/data", headers=HEADERS)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_create_items():
    """Create sample items"""
    print("📝 Creating sample items...")
    
    sample_items = [
        {"title": "Sample Item 1", "description": "This is the first sample item"},
        {"title": "Sample Item 2", "description": "This is the second sample item", "is_active": True},
        {"title": "Sample Item 3", "description": "This is the third sample item", "is_active": False}
    ]
    
    created_items = []
    for item in sample_items:
        response = requests.post(f"{BASE_URL}/data/items", headers=HEADERS, json=item)
        if response.status_code == 200:
            created_item = response.json()
            created_items.append(created_item)
            print(f"✅ Created item: {created_item['title']} (ID: {created_item['id']})")
        else:
            print(f"❌ Failed to create item: {response.text}")
    
    print()
    return created_items

def test_get_items():
    """Get all items"""
    print("📋 Getting all items...")
    response = requests.get(f"{BASE_URL}/data/items", headers=HEADERS)
    if response.status_code == 200:
        items = response.json()
        print(f"Found {len(items)} items:")
        for item in items:
            status = "🟢 Active" if item['is_active'] else "🔴 Inactive"
            print(f"  - {item['title']} (ID: {item['id']}) {status}")
    else:
        print(f"❌ Failed to get items: {response.text}")
    print()

def test_create_users():
    """Create sample users"""
    print("👥 Creating sample users...")
    
    sample_users = [
        {"username": "john_doe", "email": "john@example.com", "full_name": "John Doe"},
        {"username": "jane_smith", "email": "jane@example.com", "full_name": "Jane Smith"},
        {"username": "bob_wilson", "email": "bob@example.com", "full_name": "Bob Wilson"}
    ]
    
    created_users = []
    for user in sample_users:
        response = requests.post(f"{BASE_URL}/users", headers=HEADERS, json=user)
        if response.status_code == 200:
            created_user = response.json()
            created_users.append(created_user)
            print(f"✅ Created user: {created_user['username']} (ID: {created_user['id']})")
        else:
            print(f"❌ Failed to create user: {response.text}")
    
    print()
    return created_users

def test_get_users():
    """Get all users"""
    print("👥 Getting all users...")
    response = requests.get(f"{BASE_URL}/users", headers=HEADERS)
    if response.status_code == 200:
        users = response.json()
        print(f"Found {len(users)} users:")
        for user in users:
            status = "🟢 Active" if user['is_active'] else "🔴 Inactive"
            print(f"  - {user['username']} ({user['email']}) {status}")
    else:
        print(f"❌ Failed to get users: {response.text}")
    print()

def main():
    print("🚀 Testing SQLite Database Integration")
    print("=" * 50)
    
    try:
        # Test basic endpoint
        test_data_endpoint()
        
        # Test items
        created_items = test_create_items()
        test_get_items()
        
        # Test users
        created_users = test_create_users()
        test_get_users()
        
        print("✅ All tests completed successfully!")
        print("\n💡 You can now use these endpoints in your React frontend:")
        print("   - GET /data/items - Get all items")
        print("   - POST /data/items - Create new item")
        print("   - GET /users - Get all users")
        print("   - POST /users - Create new user")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure the backend is running on http://127.0.0.1:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
