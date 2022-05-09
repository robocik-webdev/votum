# Votum

_albo **Głosować**_

A web app for submitting anonymous votes from pre created accounts.

# run

Run `docker-compose up` inside the root directory (the one which contains `docker-compose.yml` file) of the project.\
Depending on your needs and preferences you can set secrets or database connection preferences in `.env.dev` file

# develop

Change the `start` npm script to fit your own development environment.\

### adding users to the database

Before you start, you need to setup database with `schema.sql` that is located in `./Votum/sql/` directory.
