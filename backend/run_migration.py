import os
import psycopg2
from app.core.config import settings

def run_migration():
    # Use standard postgresql URI format if Supabase URL has it
    conn = psycopg2.connect(settings.DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    
    with open("migrations/003_create_final_tables.sql", "r") as f:
        sql = f.read()
    
    try:
        cursor.execute(sql)
        print("Migration 003 applied successfully.")
    except Exception as e:
        print(f"Error applying migration: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    run_migration()
