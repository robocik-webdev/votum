# Votum

_albo **Głosować**_

A web app for submitting anonymous votes from pre created accounts.

# run

Run `docker-compose up` inside the root directory (the one which contains `docker-compose.yml` file) of the project.

# develop

Change the `start` npm script to fit your own development environment.\
Run the Svelte compiler: `cd client` `npm i` `npm run dev`

### adding users to the database

`dummy_user.py -u [USERNAME] -p [PASSWORD]`
