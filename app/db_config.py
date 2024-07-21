from mysql.connector import pooling
import os, dotenv

dotenv.load_dotenv()
dbconfig = {
  "database": "tdtDB",
  "user": "root",
  "password": os.getenv("MYSQL_PASSWORD"),
  "host": "localhost"
}
pool = pooling.MySQLConnectionPool(pool_name = "mypool", pool_size = 10, **dbconfig)