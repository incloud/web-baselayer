ARG IMAGE_TAG_SERVER

FROM ${IMAGE_TAG_SERVER} as server
WORKDIR /var/app

RUN yarn bootstrap --scope=@baselayer/common

FROM nginx:mainline-alpine as nginx
# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

COPY .docker/nginx/baselayer.conf /etc/nginx/nginx.conf

COPY ./.docker/nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
CMD /usr/local/bin/entrypoint.sh

# Add project configuration
COPY ./.docker/nginx/baselayer.conf /etc/nginx/baselayer.conf

# Fix permission issues for running as non-root user
RUN chown 2000 /etc/nginx/conf.d/ && \
  touch /var/run/nginx.pid && \
  chown -R 2000 /var/run/nginx.pid && \
  chown -R 2000 /var/cache/nginx && \
  chown -R 2000 /var/log/nginx/

RUN mkdir -p /var/www/baselayer
WORKDIR /var/www/baselayer
