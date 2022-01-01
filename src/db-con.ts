import { createPool, Pool } from 'mysql2/promise';

export interface DbConfig {
	db: string;
	host: string;
	user: string;
	password: string;
}

export function initDb(): Pool {
	return createPool({
		database: process.env.DATABASE,
		host: process.env.HOST,
		user: process.env.USER,
		password: process.env.PASSWORD,
	});
}

export async function query(connection: Pool, query: string): Promise<any> {
	try {
		const [rows, _] = await connection.query(query);
		return rows;
	} catch (error: any) {
		console.log(error);
	}
}
