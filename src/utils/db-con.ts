import { createPool, Pool } from 'mysql2/promise';

export interface DbConfig {
	db: string;
	host: string;
	user: string;
	password: string;
}

export function getDb(): Pool {
	let db: Pool | undefined = undefined;
	if (!db) {
		const database = process.env.MYSQL_DATABASE;
		const host = process.env.MYSQL_HOST;
		const user = process.env.MYSQL_USER;
		const password = process.env.MYSQL_PASSWORD;

		db = createPool({
			database,
			host,
			user,
			password,
		});
	}
	return db;
}

// should escape all queries
export async function query(connection: Pool, query: string): Promise<any> {
	try {
		const [rows, _] = await connection.query(query);
		return rows;
	} catch (error: any) {
		console.error(error);
	}
}
