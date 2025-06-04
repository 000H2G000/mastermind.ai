#!/usr/bin/env python3
"""
Test script for the Mind Map API integration with n8n
"""

import asyncio
import httpx
import json
from datetime import datetime

# API Configuration
BASE_URL = "http://127.0.0.1:8000"  # Assuming default FastAPI port
SECRET_KEY = "your-secret-key-here"  # Replace with your actual secret key

# Test cases
TEST_IDEAS = [
    "AI-powered customer service chatbot for e-commerce",
    "Sustainable food delivery service with drone technology",
    "Virtual reality fitness platform with social features",
    "Blockchain-based supply chain management system",
    "Smart home automation platform for elderly care"
]

async def test_mindmap_api():
    """Test the mind map API endpoints"""
    
    headers = {
        "Content-Type": "application/json",
        "x-app-secret": SECRET_KEY
    }
    
    print("🧠 Testing Mind Map API Integration")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=30) as client:
        
        # Test 1: Health Check
        print("\n1. 🔍 Testing health check...")
        try:
            response = await client.get(f"{BASE_URL}/mindmaps/health", headers=headers)
            if response.status_code == 200:
                print("   ✅ Health check passed")
                print(f"   Response: {response.json()}")
            else:
                print(f"   ❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"   ❌ Health check error: {e}")
            return False
        
        # Test 2: N8N Connection Test
        print("\n2. 🔗 Testing n8n connection...")
        try:
            response = await client.post(f"{BASE_URL}/mindmaps/test-n8n", headers=headers)
            result = response.json()
            if result.get("status") == "success":
                print("   ✅ N8N connection successful")
                print(f"   N8N Status: {result.get('n8n_status_code')}")
            else:
                print(f"   ⚠️  N8N connection issue: {result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"   ❌ N8N connection test error: {e}")
        
        # Test 3: Generate Mind Maps
        print(f"\n3. 🎯 Testing mind map generation with {len(TEST_IDEAS)} ideas...")
        session_id = f"test-session-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        generated_mindmaps = []
        
        for i, idea in enumerate(TEST_IDEAS, 1):
            print(f"\n   Test {i}/{len(TEST_IDEAS)}: {idea[:50]}...")
            
            try:
                payload = {
                    "idea": idea,
                    "session_id": session_id
                }
                
                response = await client.post(
                    f"{BASE_URL}/mindmaps/generate",
                    json=payload,
                    headers=headers
                )
                
                if response.status_code == 200:
                    result = response.json()
                    generated_mindmaps.append(result)
                    print(f"   ✅ Generated mind map ID: {result['id']}")
                    print(f"   📊 Nodes count: {len(result.get('nodes', []))}")
                    print(f"   💭 Idea: {result['idea'][:60]}...")
                else:
                    print(f"   ❌ Failed: {response.status_code} - {response.text[:100]}")
                    
            except Exception as e:
                print(f"   ❌ Error generating mind map: {e}")
        
        # Test 4: Retrieve Session Mind Maps
        if generated_mindmaps:
            print(f"\n4. 📋 Testing session mind map retrieval...")
            try:
                response = await client.get(
                    f"{BASE_URL}/mindmaps/session/{session_id}/mindmaps",
                    headers=headers
                )
                
                if response.status_code == 200:
                    session_mindmaps = response.json()
                    print(f"   ✅ Retrieved {len(session_mindmaps)} mind maps for session")
                    
                    for mindmap in session_mindmaps:
                        print(f"   - ID: {mindmap['id']}, Nodes: {mindmap['node_count']}, Idea: {mindmap['idea'][:40]}...")
                else:
                    print(f"   ❌ Failed to retrieve session mind maps: {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ Error retrieving session mind maps: {e}")
        
        # Test 5: Get Individual Mind Map
        if generated_mindmaps:
            mindmap_id = generated_mindmaps[0]['id']
            print(f"\n5. 🔍 Testing individual mind map retrieval (ID: {mindmap_id})...")
            
            try:
                response = await client.get(
                    f"{BASE_URL}/mindmaps/mindmap/{mindmap_id}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    mindmap_detail = response.json()
                    print(f"   ✅ Retrieved detailed mind map")
                    print(f"   📝 Idea: {mindmap_detail['idea']}")
                    print(f"   🌳 Nodes structure: {len(mindmap_detail.get('nodes', []))} root nodes")
                    
                    # Show first few nodes
                    if mindmap_detail.get('nodes'):
                        print("   📊 Sample nodes:")
                        for node in mindmap_detail['nodes'][:3]:
                            print(f"      - {node['title']} (Level: {node['level']}, Children: {len(node.get('children', []))})")
                            
                else:
                    print(f"   ❌ Failed to retrieve mind map details: {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ Error retrieving mind map details: {e}")
        
        # Test 6: Session Statistics
        print(f"\n6. 📈 Testing session statistics...")
        try:
            response = await client.get(
                f"{BASE_URL}/mindmaps/session/{session_id}/stats",
                headers=headers
            )
            
            if response.status_code == 200:
                stats = response.json()
                print(f"   ✅ Session statistics retrieved")
                print(f"   📊 Total queries: {stats.get('total_queries', 0)}")
                print(f"   🧠 Mind maps: {stats.get('mindmap_count', 0)}")
                print(f"   🕐 Created: {stats.get('created_at', 'Unknown')}")
            else:
                print(f"   ❌ Failed to retrieve session stats: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error retrieving session stats: {e}")
        
        # Test 7: Analytics
        print(f"\n7. 📊 Testing analytics...")
        try:
            response = await client.get(f"{BASE_URL}/mindmaps/analytics", headers=headers)
            
            if response.status_code == 200:
                analytics = response.json()
                print(f"   ✅ Analytics retrieved")
                print(f"   🧠 Total mind maps: {analytics.get('total_mindmaps', 0)}")
                print(f"   👥 Total sessions: {analytics.get('total_sessions', 0)}")
                print(f"   🌳 Total nodes: {analytics.get('total_nodes', 0)}")
                print(f"   📊 Avg nodes per mind map: {analytics.get('average_nodes_per_mindmap', 0):.1f}")
                
                if analytics.get('top_idea_keywords'):
                    print("   🔤 Top keywords:")
                    for keyword, count in analytics['top_idea_keywords'][:5]:
                        print(f"      - {keyword}: {count}")
                        
            else:
                print(f"   ❌ Failed to retrieve analytics: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error retrieving analytics: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Mind Map API testing completed!")
    print(f"✨ Generated {len(generated_mindmaps)} mind maps successfully")
    return True

if __name__ == "__main__":
    print("Starting Mind Map API Integration Test...")
    print("Make sure your FastAPI server is running on http://127.0.0.1:8000")
    print("Make sure n8n is running on http://localhost:5678")
    print("Press Ctrl+C to cancel\n")
    
    try:
        asyncio.run(test_mindmap_api())
    except KeyboardInterrupt:
        print("\n❌ Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
