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

		// flush redis on server restart
		await connection.flushall();

		logger.info('Creating Habit Queue');
		new QueueScheduler('Habits', { connection, maxStalledCount: 0 });
		const queue = new Queue('Habits', { connection });

		// kickoff main job every day at 1 am
		logger.info('Adding db jobs to Habits Queue');
		await queue.add(INITIAL_JOB, { name: INITIAL_JOB });
		//await queue.add(INITIAL_JOB, { name: INITIAL_JOB }, { repeat: { cron: '0 1 * * *' } });

		new Worker(
			'Habits',
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
		logger.error(error, 'Error starting the main queue.');
	}
}
