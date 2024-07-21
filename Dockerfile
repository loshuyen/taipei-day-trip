# 
FROM python:3.10

# 
WORKDIR /taipei_day_trip

# 
COPY ./requirements.txt /taipei_day_trip/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /taipei_day_trip/requirements.txt

# 
COPY ./app /taipei_day_trip/app

# 
CMD ["fastapi", "run", "app/app.py", "--port", "8000"]