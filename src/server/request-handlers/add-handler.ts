import { escape } from 'mysql2';
import { Pool } from 'mysql2/promise';
import * as cron from 'cron-validator';
import { ADD_HABIT_ERROR_MESSAGE } from '../../utils/constants';
import { getDb, query } from '../../utils/db-con';
import { extractHabitParts, extractPartDetail, extractCron } from '../../utils/message-parsers';

// add step to prevent duplicate entry per phoneNumber
export async function addHandler(messageBody: any, phoneNumber: string) {
	const [name, message, when] = extractHabitParts(messageBody);

	// get the three parts of the text message
	const nameValue = extractPartDetail(name);
	const messageValue = extractPartDetail(message);
	const whenDetails = extractPartDetail(when);

	if (cron.isValidCron(whenDetails)) {
		const cronFormat = extractCron(whenDetails);
		const db = getDb();

		await addHabit({ ...cronFormat, recipient: phoneNumber, name: nameValue, message: messageValue }, db);

		return `Created habit reminder for ${nameValue} will be sent to ${phoneNumber}.`;
	} else {
		return ADD_HABIT_ERROR_MESSAGE;
	}
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
