import os
import psycopg2
from dotenv import load_dotenv

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
# Extract project ref from https://project_ref.supabase.co
PROJECT_REF = SUPABASE_URL.split("https://")[1].split(".")[0]
DB_PASS = "F1Intelligence2026!" # From setup script
DB_HOST = f"db.{PROJECT_REF}.supabase.co"
DB_USER = "postgres"
DB_NAME = "postgres"

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'db', 'schema.sql')

def apply_schema():
    print(f"Connecting to {DB_HOST}...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=5432
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        print("Reading schema.sql...")
        with open(SCHEMA_PATH, 'r') as f:
            schema_sql = f.read()
            
        print("Executing schema...")
        cur.execute(schema_sql)
        
        print("Schema applied successfully!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error applying schema: {e}")

if __name__ == "__main__":
    apply_schema()
