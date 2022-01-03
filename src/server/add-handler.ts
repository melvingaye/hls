import { Context } from 'koa';
import { getDb, query } from '../utils/db-con';
import { escape } from 'mysql2';
import { Pool } from 'mysql2/promise';
import * as cron from 'cron-validator';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants';

export async function addReminder(ctx: Context) {
	const twiml = new MessagingResponse();
	try {
		const { Body, From } = ctx.request.body;
		const [name, message, when] = extractHabitParts(Body);

		// get the three parts of the text message
		const nameValue = extractPartDetail(name);
		const messageValue = extractPartDetail(message);
		const whenDetails = extractPartDetail(when);

		if (cron.isValidCron(whenDetails)) {
			const cronFormat = extractCron(whenDetails);
			const db = getDb();

			const habitId = await addHabit(
				{ ...cronFormat, recipient: From.slice(2), name: nameValue, message: messageValue },
				db,
			);

			twiml.message(`Habit reminder #${habitId} will be created. Reminders are sent to ${From}.`);
			ctx.body = twiml.toString();
		} else {
			twiml.message(DEFAULT_ERROR_MESSAGE);
			ctx.body = twiml.toString();
		}
	} catch (error: any) {
		console.error(error);

		twiml.message(DEFAULT_ERROR_MESSAGE);
		ctx.body = twiml.toString();
	}
}

function extractHabitParts(textMessage: string): string[] {
	return textMessage.trim().split('.');
}

function extractPartDetail(messagePortion: string): string {
	return messagePortion.trim().split('#')[1];
}

function extractCron(when: string) {
	const timeParts = when.split(' ');
	return {
		minute: timeParts[0],
		hour: timeParts[1],
		dayOfMonth: timeParts[2],
		month: timeParts[3],
		dayOfWeek: timeParts[4],
	};
}

async function addHabit(habitDetail: any, db: Pool) {
	const { name, message, minute, hour, dayOfMonth, month, dayOfWeek, recipient } = habitDetail;

	const insert = `INSERT into habit (name, message, phone_number, minute, hour, day_of_month, month, day_of_week) VALUES(${escape(
		name,
	)}, ${escape(message)}, ${escape(recipient)}, ${escape(minute)}, ${escape(hour)}, ${escape(dayOfMonth)}, ${escape(
		month,
	)}, ${escape(dayOfWeek)})`;

	const result = await query(db, insert);
	return result.insertId;
}
