import 'reflect-metadata';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getApplication } from 'src/app';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import Json from 'json5';
import { handleRequest } from 'src/utils/response';
import { CommandDispatcher } from 'src/modules/websocket/services';
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
			code: ErrorCodes.INVALID_VALUE,
		});
	}
}
export const handler = async (event: APIGatewayProxyEvent) => {
	const app = await getApplication();

	return handleRequest(app, event, async () => {
		const logger = app.get(RequestLogger);
		logger.info('Message event', { eventBody: event.body });
		const eventBody = tryParse(event.body);
		const commandDispatcher = app.get(CommandDispatcher);
		return commandDispatcher.dispatch(eventBody);
	});
};
