from db_config import pool
from datetime import datetime

class BookingModel:
    def get_unpaid_booking(user_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM booking JOIN attraction ON attraction_id=attraction.id WHERE is_paid=0 and user_id=%s;", (user_id, ))
            booking = cursor.fetchall()[0]
            booking_data = {
                "booking_id": booking[0],
                "attraction_id": booking[1],
                "attraction_name": booking[9],
                "address": booking[12],
                "date": booking[3],
                "time": booking[4],
                "price": booking[5],
            }
            cursor.execute("SELECT * FROM image WHERE attraction_id=%s", (booking[1], ))
            image = cursor.fetchall()[0]
            booking_data["image"] = image[2]
            return booking_data
        except:
            return None
        finally:
            cursor.close()
            db.close()
    
    def create_booking(attraction_id, user_id, date, time, price):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("DELETE FROM booking WHERE is_paid=0;") 
            db.commit()
            cursor.execute("INSERT INTO booking (attraction_id, user_id, date, time, price) VALUES (%s, %s, %s, %s, %s);", (attraction_id, user_id, date, time, price))
            db.commit()
        finally:
            cursor.close()
            db.close()
    
    def delete_unpaid_booking(user_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("DELETE FROM booking WHERE is_paid=0 and user_id=%s", (user_id, ))
            db.commit()
        finally:
            cursor.close()
            db.close()
    
    def get_all_booking(user_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT booking.id, attraction.name, date, time, price, is_paid, created_time, attraction.id, attraction.address FROM booking JOIN attraction ON attraction_id=attraction.id WHERE user_id=%s ORDER BY created_time DESC;", (user_id, ))
            bookings = cursor.fetchall()
            booking_data = []
            for booking in bookings:
                booking_data.append({
                    "attraction": {
                        "id": booking[7],
                        "name":  booking[1],
                        "address": booking[8],
                    },
                    "date": booking[2],
                    "time": booking[3],
                    "price": booking[4],
                    "is_paid": booking[5],
                    "created_time": booking[6].strftime("%Y-%m-%d %H:%M:%S")
                })
            return booking_data
        except:
            return None
        finally:
            cursor.close()
            db.close()