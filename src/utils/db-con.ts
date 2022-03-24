import { createPool, Pool } from 'mysql2/promise';
import { logger } from './logger';
import { camelCase } from './camel-case';
import * as env from 'env-var';

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
		const database = env.get('MYSQL_DATABASE').required().asString();
		const host = env.get('MYSQL_HOST').required().asString();
		const user = env.get('MYSQL_USER').required().asString();
		const password = env.get('MYSQL_PASSWORD').required().asString();
		const port = env.get('MYSQL_PORT').required().asPortNumber();

		logger.info('Got creds.');

		db = createPool({
			database,
			host,
			user,
			password,
			port,
		});
	}

	logger.info('Returning the db here again.');
	return db;
}

// should escape all queries consider sqlstring or another package
export async function query(connection: Pool, query: string): Promise<any> {
	try {
		const [rows] = await connection.query(query);
		return rows;
	} catch (error: any) {
		logger.error(error, 'query execution failed');
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
