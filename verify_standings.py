import requests
import json

try:
    response = requests.get("http://localhost:8000/api/standings/drivers?year=2026")
    if response.status_code == 200:
        print("✅ API Standings 2026 Response:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ API Failed Status: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Connection Error: {e}")
