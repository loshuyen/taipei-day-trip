from db_config import pool

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