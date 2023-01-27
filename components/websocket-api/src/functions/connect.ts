import 'reflect-metadata';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getApplication } from 'src/app';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { ConnectionRepository } from '../modules/connections/repositories';
import { handleRequest } from '../utils/response';

export const handler = async (event: APIGatewayProxyEvent) => {
	const app = await getApplication();

	return handleRequest(app, event, async () => {
		const logger = app.get(RequestLogger);
		logger.info('Connection event', event);

		const connectionRepository = app.get(ConnectionRepository);
		await connectionRepository.createConnection(event.requestContext.connectionId!);
	});
};
