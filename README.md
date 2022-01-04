# Habitual Line Stepper (HLS) - Bot to help with habit building

## Purpose

Experiment with building habits through automation.

### Getting Started

-   `docker-compose build`
-   `docker-compose up -d`

#### Local Requirements

1. Run the `db/create-db.sql` script to get an empty database
2. Replace `<RECIPIENT_PHONE_NUMBER>` with your phone number in `db/populate-db.sql` and then run it
3. Use [Cronguru](https://crontab.guru/) to format the time entries
4. Make sure redis is installed on your server or provide `bull` a redis config (bull depends on this).

#### Twilio Requirements

1. You'll need a twilio account for this to work [follow the steps here](https://www.twilio.com/docs/sms/tutorials/how-to-send-sms-messages-node-js#send-an-sms-message-in-node-via-the-rest-api) to get this part set up
2. Configure twilio phone number to handle webhook - more details to come

## Running

1. Run `npm run dev` - uses dotenv to preload env variables

### Chores

1. Add proper logging
2. ~~Add a way to create new task through text~~
3. Use multi-step build to make images smaller
4. Way to get all text associated with a particular phone number
5. Way to remove a habit

## Deployment

1. Get a [DigitalOcean](https://www.digitalocean.com/) account.
2. Create a project under "Projects"
3. On the top Nav click on "Create" and a dropdown opens. Select "Droplets"
4. Select "Marketplace" from the tabs.
5. Select Docker as your starting image
6. Fill out the rest of the information
7. Remove the node_modules and dist dir
8. Copy the project to your droplet `scp -r hls user@ip:~` [docs](https://man.openbsd.org/scp)
9. ssh into your droplet. Run `docker-compose build` `docker-compose up [-d]`
10. Update twilio phone number configuration with the ip of your droplet

## Notes

This was mostly a poc and there are a lot of things to do to make it more robust.
