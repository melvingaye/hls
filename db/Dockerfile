FROM mysql:5.7

ENV PORT 3306

EXPOSE 3306

COPY create-db.sql /docker-entrypoint-initdb.d/
