import { Queue, Worker } from 'bullmq';
import { processHabits } from './job-creator';
import { habitProcessor } from './habit-processor';
import IORedis from 'ioredis';

const INITIAL_JOB = 'KICK_OFF_INITIAL_JOB_GET_HABITS';

export async function startQueueProcessor() {
	try {
		const connection = new IORedis({ host: process.env.REDIS });
		const queue = new Queue('Habit Queue', { connection });

		// kickoff main job every day at 6 am
		await queue.add(INITIAL_JOB, { name: INITIAL_JOB }, { repeat: { cron: '0 6 * * *' } });

		new Worker(
			'Habit Queue',
			async (job) => {
				// might need to figure out a producer/consumer implementation similar to kafka(?) https://github.com/OptimalBits/bull
				if (job.name === INITIAL_JOB) {
					return await processHabits(job.data?.name, queue);
				} else {
					await habitProcessor(job);
				}
			},
			{ connection },
		);
	} catch (error) {
		console.error(error); // replace these logs with a proper logger
	}
}
