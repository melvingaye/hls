import { escape } from 'mysql2';
import { camelCaseRows, getDb, query } from '../../utils/db-con';
import { extractHabitParts, extractPartDetail } from '../../utils/message-parsers';
import { Habit } from '../../utils/types';

export async function viewHandler(messageBody: any, phoneNumber: string) {
	const [name, ,] = extractHabitParts(messageBody);
	const nameValue = extractPartDetail(name);

	const requestedAll = nameValue.toUpperCase() === 'ALL';
	return await getRecipientHabits(nameValue, phoneNumber, requestedAll);
}

async function getRecipientHabits(name: string, recipient: string, requestedAll: boolean) {
	const nameClause = !requestedAll ? `AND name = ${escape(name)}` : '';
	const sql = `SELECT
					name,
					message,
					phone_number,
					minute,
					hour,
					day_of_month,
					month,
					day_of_week
				FROM
					habit
				WHERE
					phone_number =  ${escape(recipient)}
				${nameClause}`;

	const rows = await query(getDb(), sql);
	const habits = camelCaseRows<Habit>(rows);

	return habits
		.map(
			(habit) =>
				`Reminder for habit ${habit.name} sent to ${habit.phoneNumber} this often "${habit.minute} ${habit.hour} ${habit.dayOfMonth} ${habit.month} ${habit.dayOfWeek}".\n`,
		)
		.join('');
}
