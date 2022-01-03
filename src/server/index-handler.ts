import { Context } from 'koa';
import { getDb } from '../utils/db-con';

export async function indexHandler(ctx: Context) {
	const db = getDb();
	if (!db) {
		ctx.body = 'Failed to connect to the db.';
	} else {
		ctx.body = 'Db succesfully connected!';
	}
}
