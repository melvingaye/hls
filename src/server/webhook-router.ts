import { Context } from 'koa';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { logger } from '../utils/logger';
import { extractHabitParts } from '../utils/message-parsers';
import { addHandler } from './request-handlers/add-handler';
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
	try {
		const { Body, From } = ctx.request.body;
		const action = getActionType(Body);
		let result = '';

		switch (action.toUpperCase()) {
			case 'ADD':
				result = await addHandler(Body, From);
				break;
			case 'VIEW':
				break;
			case 'PAUSE':
				break;
			case 'REMOVE':
				break;
			case 'CHANGE':
				break;
			case 'START':
				break;
			default:
				result = 'Sorry, system failed to process your request.';
				break;
		}

		twiml.message(result);
		ctx.body = twiml.toString();
	} catch (error: any) {
		logger.error(error);

		twiml.message(error.messsage);
		ctx.body = twiml.toString();
	}
}

function getActionType(message: any) {
	const [name, ,] = extractHabitParts(message);
	return name.split('#')[0];
}
