import { initDb, query } from './db-con';

export async function processHabits(name: string, queue: any) {
	const habits = await getHabits();

	const jobs = createJobs(habits);

	await addsJobToQueue(jobs, queue);

	const jobsWating = await queue.getJobs(['waiting']);
	console.log(jobsWating);
}

async function getHabits() {
	const con = initDb();
	return await query(con, 'SELECT * FROM habit');
}

function createJobs(habits: any[]) {
	return habits.map((habit) => {
		return {
			data: { name: habit.name, message: habit.message, phoneNumber: habit.phone_number },
			cron: `${habit.minute} ${habit.hour} ${habit.day_of_month} ${habit.month} ${habit.day_of_week}`,
		};
	});
}

async function addsJobToQueue(jobs: any[], queue: any) {
	const addedJobs = jobs.map((job) => queue.add(job.data, { repeat: { cron: job.cron } }));
	return await Promise.allSettled(addedJobs);
}
