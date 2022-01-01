import { Twilio } from 'twilio';

export async function habitProcessor(job: any) {
	const message = `Hi ya filthy animal. You wanted a reminder for: ${job.data.name}. So make sure you do this: ${job.data.message}`;
	const recipient = `+1${job.data.phoneNumber}`;

	const client = new Twilio(process.env.SID || '', process.env.AUTH_TOKEN || '');
	try {
		const messageResult = await client.messages.create({
			body: message,
			from: process.env.SENDING_NUMBER,
			to: recipient,
		});
		console.log(messageResult);
	} catch (error) {
		console.error(error);
	}
}
