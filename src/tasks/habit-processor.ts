import { Twilio } from 'twilio';
import { logger } from '../utils/logger';

export async function habitProcessor(job: any) {
	logger.info('Getting ready to send the text.');
	const message = `Hi, don't forget to: ${job.name}. So make sure you do this: ${job.data.message}`;
	const recipient = `+1${job.data.phoneNumber}`;

	logger.info('Before twilio client created.');
	const client = new Twilio(process.env.SID || '', process.env.AUTH_TOKEN || '');
	try {
		await client.messages.create({
			body: message,
			from: process.env.SENDING_NUMBER,
			to: recipient,
		});
		logger.info('Message sent to recipient.');
	} catch (error) {
		logger.error(error, 'Habit process failed.');
	}
}
