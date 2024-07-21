from db_config import pool

class AttractionModel:
    def get_attractions(keyword, page):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            if not keyword:
                sql_statement = "SELECT * FROM attraction LIMIT 13 OFFSET %s"
                vals = (page * 12, )
            else:	
                sql_statement = "SELECT * FROM attraction WHERE mrt=%s OR name LIKE %s LIMIT 13 OFFSET %s"
                vals = (keyword, '%' + keyword + '%', page * 12, )
            cursor.execute(sql_statement, vals)
            return cursor.fetchall()
        finally:
            cursor.close()
            db.close()
    
    def get_images_by_attraction_id(attraction_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT url FROM image WHERE attraction_id = %s", (attraction_id, ))
            return cursor.fetchall()
        finally:
            cursor.close()
            db.close()

    def get_attraction_by_id(attraction_id):
        try:
            db = pool.get_connection()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM attraction WHERE id=%s", (attraction_id, ))
            return cursor.fetchone()
        finally:
            cursor.close()
            db.close()