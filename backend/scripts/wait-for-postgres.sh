#!/bin/sh
# wait-for-postgres.sh# Script lifted from
# Using Docker Compose Entrypoint To Check if Postgres is Running
# https://bit.ly/2KCdFxh 
# Author: Kelly Andrewsset -ecmd="$@"# service/container name in the docker-compose file
host="$DB_HOST"
# PostgreSQL port
port="$DB_PORT"

url="http://${DB_HOST}:${DB_PORT}/"

while ! curl ${url} 2>&1 | grep '52'
do
  echo "Connecting to postgres Failed: ${url}"
  sleep 1
done
echo "Postgres is up ..."
