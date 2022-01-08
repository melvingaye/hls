import { Queue, QueueScheduler, Worker } from 'bullmq';
import { processHabits } from './job-creator';
import { habitProcessor } from './habit-processor';
import { logger } from '../utils/logger';
import IORedis from 'ioredis';

const INITIAL_JOB = 'KICK_OFF_INITIAL_JOB_GET_HABITS';

export async function startQueueProcessor() {
	logger.info('Entered startQueueProcessor');
	try {
		const connection = new IORedis({
			host: process.env.REDIS,
		});

		logger.info('Creating Habit Queue');
		const myQueueScheduler = new QueueScheduler('Habit Queue', { connection });
		const queue = new Queue('Habit Queue', { connection });

		// kickoff main job every day at 6 am
		logger.info('Adding first job to Habit Queue');
		//await queue.add(INITIAL_JOB, { name: INITIAL_JOB }, { repeat: { cron: '0 6 * * *' } });

		await queue.add(INITIAL_JOB, { name: INITIAL_JOB });

		new Worker(
			'Habit Queue',
			async (job) => {
				if (job.name === INITIAL_JOB) {
					logger.info('Processing the first job to Habit Queue');
					return await processHabits(queue);
				} else {
					logger.info('Processing secondary jobs to Habit Queue');
					await habitProcessor(job);
				}
			},
			{ connection },
		);
	} catch (error) {
		logger.error(error, 'Error starting the main queue.'); // replace these logs with a proper logger
	}
}
