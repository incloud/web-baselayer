#!/bin/bash

cd /var/app/packages/server

yarn typeorm schema:drop
yarn typeorm schema:sync
yarn fixtures
