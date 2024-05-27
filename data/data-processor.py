import json
import mysql.connector

dbconfig = {
  "database": "tdtDB",
  "user": "root",
  "password": "12345678", #TODO: fix later
  "host": "localhost"
}

db = mysql.connector.connect( pool_name = "mypool",
                              pool_size = 10,
                              **dbconfig)

with open("taipei-attractions.json", "r") as file:
    cursor = db.cursor()
    attractions = json.load(file)["result"]["results"]
    for attraction in attractions:
        urls = attraction["file"].split("https")[1:]
        filtered_urls = ["https" + url for url in urls if (url[-3:] == "jpg" or url[-3:] == "png")]
        vals = (
            attraction["_id"],
            attraction["name"],
            attraction["CAT"],
            attraction["description"],
            attraction["address"],
            attraction["direction"],
            attraction["MRT"],
            attraction["latitude"],
            attraction["longitude"],
        )
        cursor.execute("INSERT INTO attraction (id, name, category, description, address, transport, mrt, lat, lng) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", vals)
        db.commit()
        for url in filtered_urls:
            vals = (
                attraction["_id"],
                url,
            )
            cursor.execute("INSERT INTO image (attraction_id, url) VALUES (%s, %s)", vals)
            db.commit()
    db.close()