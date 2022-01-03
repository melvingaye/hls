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

### Roadmap

1. Add proper logging
2. Add a way to create new task in the db through text

## Notes

This was mostly a poc and there are a lot of things to do to make it more robust.
