# Votum

Web app for submitting anonymous votes from pre created accounts.\
It was meant to be a part of RobocikHub but later became a standalone project.

Below are some pictures and screenshots of sketches and mockups.

![votum-mockup](https://github.com/user-attachments/assets/85848e29-c13d-4f57-98e6-8eb31160eac5)

![votum-admin-mockup](https://github.com/user-attachments/assets/f98514e7-f451-400a-8d96-d6597024f95f)

![robocikhub-sketch](https://github.com/user-attachments/assets/d7ce4017-30cc-4193-8d77-1a8940238f84)

# run

Run `docker-compose up` inside the root directory (the one which contains `docker-compose.yml` file) of the project.

# develop

Change the `start` npm script to fit your own development environment.\
Run the Svelte compiler: `cd client` `npm i` `npm run dev`

### adding users to the database

`dummy_user.py -u [USERNAME] -p [PASSWORD]`
