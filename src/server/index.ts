import Koa from 'koa';
import bodyParser from 'koa-parser';
import cors from 'koa-cors';
import Router from 'koa-router';
import convert from 'koa-convert';
import { startQueueProcessor } from '../tasks/queue-processor';
import { webhookRouter } from './webhook-router';
import { indexHandler } from './request-handlers/index-handler';
import { logger } from '../utils/logger';

(async () => {
	logger.info('Initializing the server.');

	const server = new Koa();
	const router = new Router({ prefix: '/api' });

	router.post('/', webhookRouter);
	router.get('/', indexHandler);

	server.use(convert(cors()));
	server.use(convert(bodyParser()));
	server.use(router.routes());

	logger.info('Initializing the queue.');
	await startQueueProcessor();

	server.listen(process.env.PORT, () => {
		logger.info(`Server listening on ${process.env.PORT}`);
	});

	process.on('uncaughtException', (ex: Error) => {
		logger.error(ex, 'Uncaught Exception');
	});

	process.on('unhandledRejection', (ex: Error) => {
		logger.error(ex, 'Uncaught Rejection');
	});

	process.on('exit', () => {
		logger.error('Server exited.');
	});
})();
