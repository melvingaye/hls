/**
 * What habit is under development - includes
 * the recipient phone number and the message
 * to let the recipient know what they should do.
 * Could expand on this a bit more.
 *
 * The cron details about when reminders should be sent for the
 * specific habit. https://crontab.guru/
 * Will need to figure out a way for potential end users to use this
 */
export interface Habit {
	// id: number;
	// habitJobId: number;
	phoneNumber: string;
	message: string;
	minute: string;
	hour: string;
	dayOfMonth: string;
	month: string;
	dayOfWeek: string;
}
