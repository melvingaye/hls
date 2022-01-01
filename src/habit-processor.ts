import { Twilio } from 'twilio';

export async function habitProcessor(job: any) {
	console.log(`Details for ${job.data.name}`);

	const message = `Hi ${job.data.name}. Here's a reminder to: ${job.data.message}`;
	const recipient = `+1${job.data.phoneNumber}`;

	const client = new Twilio(process.env.SID || 'undefined', process.env.AUTH_TOKEN || 'undefined');
	try {
		const messageResult = await client.messages.create({
			body: message,
			from: process.env.SENDING_NUMBER || 'undefined',
			to: recipient,
		});
		console.log(messageResult);
	} catch (error) {
		console.error(error);
	}
}
