from db_config import pool
import hashlib
import os

def encode_password(password):
    hash = hashlib.sha256()
    password_secret = password + os.getenv("HASH_SECRET")
    hash.update(password_secret.encode("utf-8"))
    return hash.hexdigest()

def convert_image_to_blob(image_path):
    with open(image_path, "rb") as file:
        blob = file.read()
        return blob

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
    
    def get_photo_blob(user_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT photo FROM photo WHERE user_id=%s;", (user_id, ))
            return cursor.fetchall()[0][0]
        finally:
            cursor.close()
            db.close()
    
    def add_new_photo(user_id, photo_blob):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("INSERT INTO photo (photo, user_id) VALUES (%s, %s);", (photo_blob, user_id, ))
            new_id = cursor.lastrowid
            db.commit()
            cursor.execute("UPDATE user SET photo_id=%s WHERE id=%s;", (new_id, user_id))
            db.commit()
        finally:
            cursor.close()
            db.close()

    def update_photo(user_id, photo_blob):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("UPDATE photo SET photo=%s WHERE user_id=%s;", (photo_blob, user_id, ))
            db.commit()
        finally:
            cursor.close()
            db.close()