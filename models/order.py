from db_config import pool

class OrderModel:
    def create_order(order_id, attraction_id, user_id, date, time, price, is_paid, contact_name, contact_email, contact_phone):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("INSERT INTO orders (id, attraction_id, user_id, date, time, price, is_paid, contact_name, contact_email, contact_phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (order_id, attraction_id, user_id, date, time, price, is_paid, contact_name, contact_email, contact_phone))
            db.commit()
        finally:
            cursor.close()
            db.close()
    def mark_as_paid(order_id, user_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("UPDATE orders SET is_paid=1 WHERE id=%s;", (order_id, ))
            db.commit()
            cursor.execute("UPDATE booking SET is_paid=1 WHERE user_id=%s;", (user_id, ))
            db.commit()
        finally:
            cursor.close()
            db.close()
    def get_order_by_id(order_id) -> dict:
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("""
                SELECT orders.id, attraction_id, attraction.name, attraction.address, orders.date, orders.time, orders.price, orders.is_paid, contact_name, contact_email, contact_phone 
                FROM orders INNER JOIN attraction 
                ON attraction_id=attraction.id 
                WHERE orders.id=%s;
            """, (order_id, ))
            result = cursor.fetchall()[0]
            cursor.execute("SELECT url FROM image WHERE attraction_id=%s", (result[1], ))
            image_urls = cursor.fetchall()[0]
            if not result:
                data = {"data": None}
            else:
                data = {
                    "data": {
                        "number": result[0],
                        "price": result[6],
                        "trip": {
                        "attraction": {
                            "id": result[1],
                            "name": result[2],
                            "address": result[3],
                            "image": image_urls[0]
                        },
                        "date": result[4],
                        "time": result[5]
                        },
                        "contact": {
                        "name": result[8],
                        "email": result[9],
                        "phone": result[10]
                        },
                        "status": 0 if result[7] == 1 else 1
                    }
                    }
            return data
        except:
            return {"data": None}
        finally:
            cursor.close()
            db.close()
