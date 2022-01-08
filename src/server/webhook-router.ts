import { Context } from 'koa';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { logger } from '../utils/logger';
import { extractHabitParts } from '../utils/message-parsers';
import { addHandler } from './request-handlers/add-handler';
import { changeHandler } from './request-handlers/change-handler';
import { pauseHandler } from './request-handlers/pause-handler';
import { removeHandler } from './request-handlers/remove-handler';
import { startHandler } from './request-handlers/start-handler';
import { viewHandler } from './request-handlers/view-handler';
/**
 * Twilio SMS works through webhooks and only 1 endpoint can be specified.
 * This one endpoint will route to the correct handler based on the type
 * of action specified in the text message.
 * Actions include - Add, View - All | Name, Pause - All | Name, Remove - All | Name, Change - Name, Start - Name | All.
 * Example - Add#Running. View#All, View#Running,
 * @param ctx
 */
export async function webhookRouter(ctx: Context) {
	const twiml = new MessagingResponse();
	let result = '';

	try {
		const { Body, From } = ctx.request.body;
		const action = getActionType(Body);

		switch (action.toUpperCase()) {
			case 'ADD':
				result = await addHandler(Body, From);
				break;
			case 'VIEW':
				result = viewHandler();
				break;
			case 'PAUSE':
				result = pauseHandler();
				break;
			case 'REMOVE':
				result = removeHandler();
				break;
			case 'CHANGE':
				result = changeHandler();
				break;
			case 'START':
				result = startHandler();
				break;
			default:
				result = 'Sorry, system failed to process your request.';
				break;
		}

		twiml.message(result);
		ctx.body = twiml.toString();
	} catch (error: any) {
		logger.error(error);

		twiml.message(result);
		ctx.body = twiml.toString();
	}
}

function getActionType(message: any) {
	const [name, ,] = extractHabitParts(message);
	return name.split('#')[0];
}
