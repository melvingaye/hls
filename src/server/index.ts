import Koa from 'koa';
import bodyParser from 'koa-parser';
import cors from 'koa-cors';
import Router from 'koa-router';
import convert from 'koa-convert';
import { startQueueProcessor } from '../tasks/queue-processor';
import { addReminder } from './add-handler';
import { indexHandler } from './index-handler';

// https://cloudnweb.dev/2019/09/building-a-production-ready-node-js-app-with-typescript-and-docker/
// https://technotrampoline.com/articles/storing-encrypted-env-files-inside-your-git-repo/
// https://towardsdatascience.com/the-complete-guide-to-docker-volumes-1a06051d2cce
(async () => {
	const server = new Koa();
	const router = new Router({ prefix: '/api' });

	router.post('/', addReminder);
	router.get('/', indexHandler);
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
