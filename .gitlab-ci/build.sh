#!/usr/bin/env bash
set -e

docker login -u gitlab-ci-token -p $CI_JOB_TOKEN $CI_REGISTRY
docker pull $CACHE_IMAGE_TAG_SERVER || true
docker pull $CACHE_IMAGE_TAG_NGINX || true
docker pull $CACHE_IMAGE_TAG_POSTGRES || true

docker build \
  --cache-from $CACHE_IMAGE_TAG_SERVER \
  -t $IMAGE_TAG_SERVER \
  -f .docker/server/Dockerfile \
  .

docker build \
  --cache-from $CACHE_IMAGE_TAG_NGINX \
  -t $IMAGE_TAG_NGINX \
  --build-arg IMAGE_TAG_SERVER=$IMAGE_TAG_SERVER \
  -f .docker/nginx/Dockerfile \
  .

docker build \
  --cache-from $CACHE_IMAGE_TAG_POSTGRES \
  -t $IMAGE_TAG_POSTGRES \
  -f .docker/postgres/Dockerfile \
  .

docker push $IMAGE_TAG_SERVER
docker push $IMAGE_TAG_NGINX
docker push $IMAGE_TAG_POSTGRES
