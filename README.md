# Habitual Line Stepper (HLS) - Bot to help with habit building

## Purpose

Experiment with building habits through automation.

### Set-up

#### Local Requirements

1. Run the `create-db.sql` script to get an empty database
2. Replace `<RECIPIENT_PHONE_NUMBER>` with your phone number in `populate-db.sql` and then run it
3. Use [Cronguru](https://crontab.guru/) to format the time entries

#### Twilio Requirements

1. You'll need a twilio account for this to work [follow the steps here](https://www.twilio.com/docs/sms/tutorials/how-to-send-sms-messages-node-js#send-an-sms-message-in-node-via-the-rest-api) to get this part set up

## Running

1. Run `npm run dev` - uses dotenv to preload env variables

## Notes

This was mostly a poc and there are a lot of things to do to make it more robust.
