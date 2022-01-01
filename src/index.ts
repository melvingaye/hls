import Bull from 'bull';
import { processHabits } from './job-creator';
import { habitProcessor } from './habit-processor';

const INITIAL_JOB = 'KICK_OFF_INITIAL_JOB_GET_HABITS';
(async () => {
	try {
		console.log('entered');
		const queue = new Bull('Test queue');
		console.log(queue);
		console.log('entered 2');
		await queue.add({ name: INITIAL_JOB }); // should kickoff everyday at 3 am
		console.log('entered 3');
		console.log('process');
		queue.process(async (job) => {
			// not sure if this is the right way to do this but havent seen any clear documentation of this
			// or how to use another queue to process jobs from another queue
			// or could the purpose of this queue be that it runs only once and all it does is add
			// task to a new queue that will then run all the habit jobs
			console.log('init_job');
			if (job.data?.name === INITIAL_JOB) {
				return await processHabits(job.data?.name, queue);
			} else {
				await habitProcessor(job);
			}
		});
	} catch (error) {
		console.log(error);
	}

	process.on('uncaughtException', (e) => {
		console.log(e);
	});

	process.on('unhandledRejection', (e) => {
		console.log(e);
	});

	process.on('exit', (code) => {
		console.log(code);
	});
})();
