#!/bin/bash

# Clear all keys from all redis databases
docker-compose run --rm redis redis-cli -h redis -p 6379 FLUSHALL

# Reset the 
docker-compose run --rm server packages/server/bin/reset-postgres-db.sh