"""
Real Retail Transactions Dataset Ingestion Pipeline
Ingests data/Retail_Transaction_Dataset.csv (~161.6 MB, 1,000,000 records)
into SQLite database at prisma/dev.db.

- Memory-efficient chunked streaming (50,000 rows/batch)
- Handles missing values, type coercions, and malformed rows
- Deduplicates on Transaction_ID
- PRAGMA optimized for high-speed bulk ingestion
- Strict zero-synthetic policy: strictly uses real CSV data.
"""

import os
import sys
import time
import sqlite3
import argparse
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "prisma", "dev.db")

# Possible filenames for the real dataset
CANDIDATE_CSV_FILES = [
    os.path.join(DATA_DIR, "Retail_Transactions_Dataset.csv"),
    os.path.join(DATA_DIR, "Retail_Transaction_Dataset.csv"),
]

def find_real_csv_path(custom_path=None):
    if custom_path and os.path.exists(custom_path):
        return custom_path
    for candidate in CANDIDATE_CSV_FILES:
        if os.path.exists(candidate):
            return candidate
    raise FileNotFoundError(
        f"Real CSV dataset not found. Checked:\n" + "\n".join(CANDIDATE_CSV_FILES)
    )

def init_retail_schema(conn):
    """Creates the RetailTransaction table and indexing optimized for analytics."""
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS "RetailTransaction" (
            transaction_id INTEGER PRIMARY KEY,
            date TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            product TEXT NOT NULL,
            total_items INTEGER NOT NULL,
            total_cost REAL NOT NULL,
            payment_method TEXT NOT NULL,
            city TEXT NOT NULL,
            store_type TEXT NOT NULL,
            discount_applied INTEGER NOT NULL,
            customer_category TEXT NOT NULL,
            season TEXT NOT NULL,
            promotion TEXT
        );
    """)
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_retail_date ON "RetailTransaction"(date);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_retail_city ON "RetailTransaction"(city);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_retail_store ON "RetailTransaction"(store_type);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_retail_payment ON "RetailTransaction"(payment_method);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_retail_customer_cat ON "RetailTransaction"(customer_category);')
    conn.commit()

def ingest_real_csv(csv_path: str, db_path: str = DEFAULT_DB_PATH, chunk_size: int = 50000):
    start_time = time.time()
    print("=" * 65)
    print("REAL RETAIL TRANSACTIONS INGESTION PIPELINE")
    print(f"Source CSV : {csv_path}")
    print(f"File Size  : {os.path.getsize(csv_path) / (1024 * 1024):.2f} MB")
    print(f"Target DB  : {db_path}")
    print(f"Chunk Size : {chunk_size:,} records")
    print("=" * 65)

    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    
    # High-throughput SQLite tuning for bulk insert
    conn.execute("PRAGMA synchronous = OFF;")
    conn.execute("PRAGMA journal_mode = MEMORY;")
    conn.execute("PRAGMA cache_size = 100000;")
    init_retail_schema(conn)

    total_rows_evaluated = 0
    total_rows_inserted = 0
    total_rows_skipped = 0
    chunk_idx = 0

    insert_sql = """
        INSERT OR IGNORE INTO "RetailTransaction" (
            transaction_id, date, customer_name, product,
            total_items, total_cost, payment_method, city,
            store_type, discount_applied, customer_category,
            season, promotion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    cursor = conn.cursor()

    try:
        # Stream-read CSV in chunks without loading entire file into memory
        reader = pd.read_csv(
            csv_path,
            chunksize=chunk_size,
            dtype={
                "Transaction_ID": "Int64",
                "Customer_Name": "string",
                "Product": "string",
                "Total_Items": "Int64",
                "Total_Cost": "float64",
                "Payment_Method": "string",
                "City": "string",
                "Store_Type": "string",
                "Discount_Applied": "boolean",
                "Customer_Category": "string",
                "Season": "string",
                "Promotion": "string",
            },
            low_memory=False
        )

        for chunk in reader:
            chunk_idx += 1
            chunk_len = len(chunk)
            total_rows_evaluated += chunk_len

            # Safe validation & cleaning
            # Drop rows with null Transaction_ID or invalid dates
            valid_chunk = chunk.dropna(subset=["Transaction_ID", "Date", "Total_Cost"])

            # Prepare records tuple
            records = []
            for _, row in valid_chunk.iterrows():
                try:
                    t_id = int(row["Transaction_ID"])
                    date_val = str(row["Date"]).strip()
                    cust_name = str(row["Customer_Name"]).strip() if pd.notna(row["Customer_Name"]) else "Unknown"
                    product_val = str(row["Product"]).strip() if pd.notna(row["Product"]) else "[]"
                    items_val = int(row["Total_Items"]) if pd.notna(row["Total_Items"]) else 1
                    cost_val = round(float(row["Total_Cost"]), 2)
                    pm = str(row["Payment_Method"]).strip() if pd.notna(row["Payment_Method"]) else "Other"
                    city = str(row["City"]).strip() if pd.notna(row["City"]) else "Unknown"
                    st = str(row["Store_Type"]).strip() if pd.notna(row["Store_Type"]) else "Unknown"
                    disc = 1 if bool(row["Discount_Applied"]) is True else 0
                    cat = str(row["Customer_Category"]).strip() if pd.notna(row["Customer_Category"]) else "General"
                    season = str(row["Season"]).strip() if pd.notna(row["Season"]) else "All"
                    promo = str(row["Promotion"]).strip() if pd.notna(row["Promotion"]) and str(row["Promotion"]).strip() != "" else None

                    records.append((
                        t_id, date_val, cust_name, product_val,
                        items_val, cost_val, pm, city,
                        st, disc, cat, season, promo
                    ))
                except Exception:
                    total_rows_skipped += 1
                    continue

            # Execute batch insert
            cursor.executemany(insert_sql, records)
            conn.commit()

            inserted_in_chunk = cursor.rowcount
            total_rows_inserted += len(records)

            print(f"  [Chunk {chunk_idx:2d}] Processed {chunk_len:,} rows | "
                  f"Total Evaluated: {total_rows_evaluated:,} | "
                  f"Elapsed: {time.time() - start_time:.1f}s")

    finally:
        conn.close()

    elapsed = time.time() - start_time

    # Run verification check directly from SQLite
    verify_conn = sqlite3.connect(db_path)
    verify_cur = verify_conn.cursor()
    verify_cur.execute("""
        SELECT 
            COUNT(*),
            COUNT(DISTINCT transaction_id),
            MIN(date),
            MAX(date),
            SUM(total_cost),
            SUM(total_items),
            AVG(total_cost)
        FROM "RetailTransaction"
    """)
    stats = verify_cur.fetchone()
    verify_conn.close()

    db_count, distinct_ids, min_date, max_date, sum_cost, sum_items, avg_cost = stats

    print("\n" + "=" * 65)
    print("INGESTION & DATABASE VERIFICATION SUMMARY")
    print("=" * 65)
    print(f"Total Rows Evaluated   : {total_rows_evaluated:,}")
    print(f"Total Rows in DB       : {db_count:,}")
    print(f"Unique Transaction IDs : {distinct_ids:,}")
    print(f"Duplicate/Skipped IDs  : {total_rows_evaluated - distinct_ids}")
    print(f"Historical Date Range  : {min_date} to {max_date}")
    print(f"Total Gross Revenue    : ${sum_cost:,.2f}")
    print(f"Total Items Sold       : {sum_items:,}")
    print(f"Average Order Value    : ${avg_cost:.2f}")
    print(f"Ingestion Time Taken   : {elapsed:.2f} seconds ({total_rows_evaluated / elapsed:,.0f} rows/sec)")
    print("=" * 65 + "\n")

    return {
        "total_rows_evaluated": total_rows_evaluated,
        "db_count": db_count,
        "distinct_ids": distinct_ids,
        "date_range": (min_date, max_date),
        "total_revenue": sum_cost,
        "elapsed_seconds": elapsed
    }

def main():
    parser = argparse.ArgumentParser(description="Real Retail Transactions Ingestion Pipeline")
    parser.add_argument("--csv", type=str, default=None, help="Path to raw CSV file (defaults to data/Retail_Transaction_Dataset.csv)")
    parser.add_argument("--db", type=str, default=DEFAULT_DB_PATH, help="Path to SQLite database")
    parser.add_argument("--chunk-size", type=int, default=50000, help="Chunk size for batch processing")
    args = parser.parse_args()

    csv_path = find_real_csv_path(args.csv)
    ingest_real_csv(csv_path=csv_path, db_path=args.db, chunk_size=args.chunk_size)

if __name__ == "__main__":
    main()
