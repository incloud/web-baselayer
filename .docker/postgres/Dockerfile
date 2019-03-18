FROM postgres:11.1-alpine

RUN adduser -D -G postgres baselayer
RUN mkdir -p /var/lib/postgresql/data/
RUN chown -R 1000:70 /var/lib/postgresql/data/
