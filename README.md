# GOT Mini App

Simple demo app with 3 containers:
- `home` — nginx static site (landing page)
- `house` — Node/Express app (two instances with different HOUSE_LIST environment variable)

## Quick start (manual on EC2)
1. Build images:
   ```bash
   docker build -t got-home ./home
   docker build -t got-house ./house
   ```
2. Run containers (replace RDS values):
   ```bash
   docker run -d --name got-home -p 80:80 got-home

   docker run -d --name got-house1 -p 3001:3000 \
     -e DB_HOST=<RDS_ENDPOINT> -e DB_USER=gotadmin -e DB_PASS='<DB_PASS>' -e DB_NAME=gotdb \
     -e HOUSE_LIST="Stark,Lannister" got-house

   docker run -d --name got-house2 -p 3002:3000 \
     -e DB_HOST=<RDS_ENDPOINT> -e DB_USER=gotadmin -e DB_PASS='<DB_PASS>' -e DB_NAME=gotdb \
     -e HOUSE_LIST="Targaryen,Baratheon" got-house
   ```

## DB schema
Run on your Postgres RDS instance:
```sql
CREATE DATABASE gotdb;
\c gotdb
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  house VARCHAR(100),
  question TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```
