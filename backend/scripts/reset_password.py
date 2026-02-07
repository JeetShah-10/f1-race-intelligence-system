import requests
import os
from dotenv import load_dotenv

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
if not SUPABASE_URL:
    print("Error: SUPABASE_URL not found in .env. Run setup_supabase.py first.")
    exit(1)

PROJECT_REF = SUPABASE_URL.split("https://")[1].split(".")[0]
ACCESS_TOKEN = "sbp_24d834c629387ad97b4db877aef820ebcc3f51b2"
NEW_PASS = "F1Intelligence2026!"

API_URL = "https://api.supabase.com/v1"
headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json"
}

def reset_password():
    print(f"Resetting password for project {PROJECT_REF}...")
    url = f"{API_URL}/projects/{PROJECT_REF}/database/password"
    payload = {"password": NEW_PASS}
    
    resp = requests.post(url, json=payload, headers=headers)
    
    print(f"Response Status: {resp.status_code}")
    with open("reset.log", "w") as f:
        f.write(f"Status: {resp.status_code}\n")
        f.write(f"Body: {resp.text}\n")
    
    if resp.status_code == 200:
        print("Password reset successfully.")
    else:
        print(f"Error resetting password. Check reset.log")

if __name__ == "__main__":
    reset_password()
