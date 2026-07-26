import sqlite3

connection = sqlite3.connect("symptom.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS symptom_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    symptoms TEXT,
    prediction TEXT,
    age INTEGER,
    disease TEXT
)
""")

connection.commit()

connection.close()

print("Database created successfully!")