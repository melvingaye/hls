import { createPool, Pool } from 'mysql2/promise';

export interface DbConfig {
	db: string;
	host: string;
	user: string;
	password: string;
}

export function initDb(config?: DbConfig): Pool {
	return createPool({
		database: config?.db || process.env.DATABASE,
		host: config?.host || process.env.HOST,
		user: config?.user || process.env.USER,
		password: config?.password || process.env.PASSWORD,
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
