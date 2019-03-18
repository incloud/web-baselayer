#!/usr/bin/env sh

set -e

# As suggested in the official documentation:
# https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration
# envsubst < /etc/nginx/conf.d/project.conf.template > /etc/nginx/conf.d/project.conf
nginx -g 'daemon off;'
