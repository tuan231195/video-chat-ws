import 'reflect-metadata';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getApplication } from 'src/app';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import Json from 'json5';
import { error, handleRequest } from 'src/utils/response';
import { CommandDispatcher } from 'src/modules/command/services';
import { BadRequestException } from '@nestjs/common';
import { ErrorCodes } from 'src/utils/error-codes';

function tryParse(eventBody: any) {
	try {
		if (typeof eventBody === 'string') {
			return Json.parse(eventBody);
		}
		return eventBody;
	} catch (err) {
		throw new BadRequestException({
			message: 'Invalid json message',
			code: ErrorCodes.INVALID_FORMAT,
		});
	}
}
export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
	const app = await getApplication();

	return handleRequest(app, { event, context }, async () => {
		const logger = app.get(RequestLogger);
		logger.debug('Message event', { event });
		const eventBody = tryParse(event.body);
		const action = eventBody?.action;
		const correlationId = eventBody?.correlationId;
		if (!action) {
			throw new BadRequestException({
				message: 'Action is required',
				code: ErrorCodes.VALUE_REQUIRED,
			});
		}
		try {
			const commandDispatcher = app.get(CommandDispatcher);
			const dispatchResult = await commandDispatcher.dispatch(eventBody);
			return {
				action: `${action}:succeeded`,
				result: dispatchResult,
				correlationId,
			};
		} catch (err) {
			logger.info(`Failed to handle action ${action}`, {
				err,
			});
			return {
				action: `${action}:failed`,
				result: error(err),
				correlationId,
			};
		}
	});
};
