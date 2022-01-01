import { getDb, query } from '../utils/db-con';

export async function processHabits(name: string, queue: any) {
	const habits = await getHabits();

	const jobs = createJobs(habits);

	await addsJobToQueue(jobs, queue);

	const jobsWating = await queue.getJobs(['waiting']);
}

async function getHabits() {
	const con = getDb();
	return await query(con, 'SELECT * FROM habit');
}

// TODO: refactory to handle single job creation and use map to process multiple habits in processHabits
function createJobs(habits: any[]) {
	return habits.map((habit) => {
		return {
			data: { name: habit.name, message: habit.message, phoneNumber: habit.phone_number },
			cron: `${habit.minute} ${habit.hour} ${habit.day_of_month} ${habit.month} ${habit.day_of_week}`,
		};
	});
}

// TODO: refactory to handle adding single job  and use map to add multiple jobs in processHabits
async function addsJobToQueue(jobs: any[], queue: any) {
	const addedJobs = jobs.map((job) => queue.add(job.data, { repeat: { cron: job.cron } }));
	return await Promise.allSettled(addedJobs);
}
