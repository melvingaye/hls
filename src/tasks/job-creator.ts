import { getDb, query } from '../utils/db-con';

export async function processHabits(name: string, queue: any) {
	const habits = await getHabits();
	const jobs = habits?.map(createJob);

	const queuedJobs = jobs?.map((job: any) => addJobToQueue(job, queue));

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
