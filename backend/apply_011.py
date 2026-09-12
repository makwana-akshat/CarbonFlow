import psycopg2
from app.core.config import settings
def run():
    conn = psycopg2.connect(settings.DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    with open("migrations/011_add_contract_refs.sql", "r") as f:
        sql = f.read()
    try:
        cursor.execute(sql)
        print("011 migration applied successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()
if __name__ == "__main__":
    run()
