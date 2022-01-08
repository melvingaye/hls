import { Context } from 'koa';
import { getDb, query, camelCaseRows } from '../../utils/db-con';
import { camelCase } from '../../utils/camel-case';
import { Habit } from '../../utils/types';
import { logger } from '../../utils/logger';

export async function indexHandler(ctx: Context) {
	logger.info(`Request recieved from ${ctx.request.ip}`);

	const db = getDb();
	if (!db) {
		ctx.body = 'Failed to connect to the db.';
	} else {
		const result = await query(db, 'Select habit_id from habit where habit_id = 1');
		ctx.body = { test: camelCase('test_value_three'), result };
	}
}
