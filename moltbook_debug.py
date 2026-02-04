#!/usr/bin/env python3
"""Debug Moltbook API"""
import http.client
import json

API_KEY = "moltbook_sk_DrZqx7kEcs4QapxRYiDDlqSA01eT6nR5"
HOST = "www.moltbook.com"

def api_request(path, method="GET", data=None):
    """Make API request"""
    conn = http.client.HTTPSConnection(HOST, timeout=10)
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        if data:
            conn.request(method, path, json.dumps(data), headers)
        else:
            conn.request(method, path, headers=headers)
        response = conn.getresponse()
        body = response.read().decode('utf-8')
        print(f"Response {response.status}: {body[:500]}")
        if response.status >= 200 and response.status < 300:
            try:
                return json.loads(body)
            except json.JSONDecodeError:
                return body
        else:
            return None
    except Exception as e:
        print(f"Exception: {e}")
        return None
    finally:
        conn.close()

print("=== Debug Moltbook API ===\n")

print("1. Testing /api/v1/agents/me...")
me = api_request("/api/v1/agents/me")
print(f"Result: {me}\n")

print("2. Testing /api/v1/posts?sort=hot&limit=10...")
hot = api_request("/api/v1/posts?sort=hot&limit=10")
print(f"Result: {hot}\n")

print("3. Testing /api/v1/posts?sort=new&limit=10...")
new = api_request("/api/v1/posts?sort=new&limit=10")
print(f"Result: {new}\n")
