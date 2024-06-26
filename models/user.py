from db_config import pool
import hashlib
import os

def encode_password(password):
    hash = hashlib.sha256()
    password_secret = password + os.getenv("HASH_SECRET")
    hash.update(password_secret.encode("utf-8"))
    return hash.hexdigest()

class UserModel:
    def get_username_by_email(email: str) -> tuple:
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT name FROM user WHERE email=%s;", (email, ))
            return cursor.fetchone()
        finally:
            cursor.close()
            db.close()
    
    def insert_new_user(name: str, email: str, password: str) -> None:
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            hashed_password = encode_password(password)
            cursor.execute("INSERT INTO user (name, email, password) VALUES (%s, %s, %s);", (name, email, hashed_password))
            db.commit()
        finally:
            cursor.close()
            db.close()
    
    def get_user_by_email_password(email: str, password: str) -> tuple:
        try:
            hashed_password = encode_password(password)
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM user WHERE email=%s and password=%s;", (email, hashed_password))
            return cursor.fetchone()
        finally:
            cursor.close()
            db.close()