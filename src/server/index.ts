import Koa from 'koa';
import bodyParser from 'koa-parser';
import cors from 'koa-cors';
import Router from 'koa-router';
import convert from 'koa-convert';
import { startQueueProcessor } from '../tasks/queue-processor';
import { addReminder } from './add-handler';

(async () => {
	const server = new Koa();
	const router = new Router({ prefix: '/api' });

	router.post('/', addReminder);

	server.use(convert(cors()));
	server.use(convert(bodyParser()));
	server.use(router.routes());

	await startQueueProcessor();

	server.listen(process.env.PORT, () => {
		console.info(`Server listening on ${process.env.PORT}`);
	});

	process.on('uncaughtException', (ex: any) => {
		console.error('Uncaught Exception', ex);
	});

	process.on('unhandledRejection', (ex: any) => {
		console.error('Uncaught Rejection', ex);
	});

	process.on('exit', () => {
		console.error('Server exited.');
	});
})();
