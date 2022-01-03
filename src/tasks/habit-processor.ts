import { Twilio } from 'twilio';

export async function habitProcessor(job: any) {
	const message = `Hi, don't forget to: ${job.name}. So make sure you do this: ${job.data.message}`;
	const recipient = `+1${job.data.phoneNumber}`;

	const client = new Twilio(process.env.SID || '', process.env.AUTH_TOKEN || '');
	try {
		await client.messages.create({
			body: message,
			from: process.env.SENDING_NUMBER,
			to: recipient,
		});
	} catch (error) {
		console.error(error);
	}
}
