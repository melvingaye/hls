import { createPool, Pool } from 'mysql2/promise';
import { logger } from './logger';
import { camelCase } from './camel-case';

export interface DbConfig {
	db: string;
	host: string;
	user: string;
	password: string;
}

export function getDb(): Pool {
	let db: Pool | undefined;

	logger.info('Getting db object.');

	if (!db) {
		const database = process.env.MYSQL_DATABASE;
		const host = process.env.MYSQL_HOST;
		const user = process.env.MYSQL_USER;
		const password = process.env.MYSQL_PASSWORD;
		const port = +!process.env.MYSQL_PORT; // dont do this!!! replace with env-var

		logger.info('Validate db creds');
		logger.info({ database, host, user, password });

		db = createPool({
			database,
			host,
			user,
			password,
			port,
		});
	}

	logger.info(db);
	return db;
}

// should escape all queries consider sqlstring or another package
export async function query(connection: Pool, query: string): Promise<any> {
	try {
		const [rows, _] = await connection.query(query);
		return rows;
	} catch (error: any) {
		logger.error(error, 'query execution failed.');
		throw new Error('Failed to execute query');
	}
}

export function camelCaseRows<T>(rows: any): T[] {
	return rows?.map((entry: any) => camelCaseObjectProperties(entry)) as T[];
}

function camelCaseObjectProperties(object: any) {
	const copy = (obj: any) => Object.assign({}, obj);

	const copiedObject = copy(object);
	for (const [key, value] of Object.entries(copiedObject)) {
		copiedObject[camelCase(key)] = value;

		if (camelCase(key) !== key) {
			delete copiedObject[key];
		}
	}

	return copiedObject;
}
