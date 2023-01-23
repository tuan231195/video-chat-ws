import 'reflect-metadata';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getApplication } from 'src/app';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { ConnectionRepository } from 'src/modules/websocket/repositories/connection-repository.service';
import { handleRequest } from 'src/utils/response';

export const handler = async (event: APIGatewayProxyEvent) => {
	const app = await getApplication();

	return handleRequest(app, event, async () => {
		const logger = app.get(RequestLogger);
		logger.info('Disconnection event', event);

		const connectionRepository = app.get(ConnectionRepository);
		await connectionRepository.destroyConnection(event.requestContext.connectionId!);
	});
};
