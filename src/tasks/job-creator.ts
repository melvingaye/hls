import { Job, Queue } from 'bullmq';
import { getDb, query } from '../utils/db-con';
import { logger } from '../utils/logger';

export async function processHabits(queue: Queue) {
	logger.info('Before getting the habits from the db');
	const habits = await getHabits();

	logger.info(habits, 'Habits from the db');
	const jobs = habits?.map(createJob);

	logger.info(jobs, 'Jobs from Habits from the db');
	const queuedJobs = jobs?.map((job: Job) => addJobToQueue(job, queue));

	await Promise.allSettled(queuedJobs);
}

async function getHabits() {
	const con = getDb();

	return await query(con, 'SELECT * FROM habit');
}

function createJob(habit: any) {
	return {
		name: habit.name,
		data: { message: habit.message, phoneNumber: habit.phone_number },
		cron: `${habit.minute} ${habit.hour} ${habit.day_of_month} ${habit.month} ${habit.day_of_week}`,
	};
}

async function addJobToQueue(job: any, queue: any) {
	return await queue.add(job.name, job.data, { repeat: { cron: job.cron } });
}
