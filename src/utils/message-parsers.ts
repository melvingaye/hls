import * as cron from 'cron-validator';

export function extractHabitParts(textMessage: string): string[] {
	return textMessage.trim().split('.');
}

export function extractPartDetail(messagePortion: string): string {
	return messagePortion.trim().split('#')[1];
}

export function extractCron(when: string) {
	const timeParts = when.split(' ');
	return {
		minute: timeParts[0],
		hour: timeParts[1],
		dayOfMonth: timeParts[2],
		month: timeParts[3],
		dayOfWeek: timeParts[4],
	};
}

export function isValidTime(scheduledTime: string) {
	cron.isValidCron(scheduledTime);
}
