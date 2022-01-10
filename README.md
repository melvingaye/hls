# Habitual Line Stepper (HLS) - Bot to help with habit building

## Purpose

Experiment with building habits through automated text messages. The idea is that people
have their phones with them all day and phones are like personal confidants. So getting
a reminder from something a person is already so intimate with will improve the odds of developing
the desired about they are getting reminders about.

## Getting Started

### Twilio Requirements

1. You'll need a twilio account for this to work [follow the steps here](https://www.twilio.com/docs/sms/tutorials/how-to-send-sms-messages-node-js#send-an-sms-message-in-node-via-the-rest-api) to get this part set up
2. Configure twilio phone number webook by adding an endpoint (ngrok can be used for local testing)

### Development

1. Fork/pull the repo and run `npm i` in the root dir (all commands are ran in root dir)
2. Start Docker (if you don't have it install it)
3. Run `docker-compose -f .\docker-compose.dev.yml build`
4. Run `docker-compose -f .\docker-compose.dev.yml up -d`
5. Use vscode Run and debug menu to run "Launch Server API"

### Testing

1. Add your first habit using Postman or insomnia
    - request body should look like this
      `{"Body": "Add#Test Habit. Message#Testing. When#*/1 * * * *.", "From": "+1<YOUR_PHONE_NUMBER>"}`
    - Use [Cronguru](https://crontab.guru/) to format the time entries and create

## Future Work

1. ~~Add proper logging~~
2. ~~Add a way to create new task through text~~
3. Use multi-step build to make images smaller
4. Add feature to get all habits associated with a particular phone number
5. Add feature to remove a habit

## Deployment

1. Get a [DigitalOcean](https://www.digitalocean.com/) account.
2. Create a project under "Projects"
3. On the top Nav click on "Create" and a dropdown opens. Select "Droplets"
4. Select "Marketplace" from the tabs.
5. Select Docker as your starting image
6. Fill out the rest of the information
7. Remove the `node_modules`, `dist`, and `.vscode` dir
8. Copy the project to your droplet `scp -r hls <DROPLET_USER>@<DROPLET_IP>:~` [docs](https://man.openbsd.org/scp)
9. ssh into your droplet. Run `docker-compose build` `docker-compose up [-d]`
10. Update twilio phone number configuration with the ip of your droplet
