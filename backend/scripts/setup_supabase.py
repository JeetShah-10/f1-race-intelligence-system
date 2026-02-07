import requests
import time
import json
import os

# Configuration
API_URL = "https://api.supabase.com/v1"
ACCESS_TOKEN = "sbp_24d834c629387ad97b4db877aef820ebcc3f51b2"
PROJECT_NAME = "F1 Meow 01"
DB_PASS = "F1Intelligence2026!" # Need a strong password for creation
REGION = "us-east-1"

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json"
}

def get_organizations():
    print("Fetching organizations...")
    resp = requests.get(f"{API_URL}/organizations", headers=headers)
    if resp.status_code != 200:
        print(f"Error fetching orgs: {resp.text}")
        return []
    return resp.json()

def get_projects():
    print("Fetching projects...")
    resp = requests.get(f"{API_URL}/projects", headers=headers)
    if resp.status_code != 200:
        print(f"Error fetching projects: {resp.text}")
        return []
    return resp.json()

def get_api_keys(project_ref):
    print(f"Fetching API keys for {project_ref}...")
    resp = requests.get(f"{API_URL}/projects/{project_ref}/api-keys", headers=headers)
    if resp.status_code != 200:
        print(f"Error fetching keys: {resp.text}")
        return None
    return resp.json()

def main():
    # 1. Get Organization
    orgs = get_organizations()
    if not orgs:
        print("No organizations found. Please create one in Supabase Dashboard.")
        return
    
    # Pick first org
    org = orgs[0]
    org_id = org['id']
    print(f"Using Organization: {org['name']} ({org_id})")

    # 2. Check for existing project
    projects = get_projects()
    print(f"Found {len(projects)} projects.")
    
    target_project = next((p for p in projects if p['name'] == PROJECT_NAME), None)
    
    if target_project:
        print(f"Found existing project: {target_project['name']} ({target_project['id']})")
    else:
        print(f"Project '{PROJECT_NAME}' not found.")
        return

    project_ref = target_project['id']
    
    # 3. Get Credentials
    keys = get_api_keys(project_ref)
    
    if keys:
        anon = next((k for k in keys if k['name'] == 'anon'), None)
        service = next((k for k in keys if k['name'] == 'service_role'), None)
        
        env_content = f"""SUPABASE_URL=https://{project_ref}.supabase.co
SUPABASE_ANON_KEY={anon['api_key'] if anon else ''}
SUPABASE_SERVICE_KEY={service['api_key'] if service else ''}
SUPABASE_KEY={service['api_key'] if service else ''}
"""
        # backend/.env
        env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
        env_path = os.path.abspath(env_path)
        
        with open(env_path, "w") as f:
            f.write(env_content)
        
        print(f"Credentials successfully written to {env_path}")
    else:
        print("Could not fetch keys.")

if __name__ == "__main__":
    main()
