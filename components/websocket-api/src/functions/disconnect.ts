import 'reflect-metadata';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getApplication } from 'src/app';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { ConnectionRepository } from 'src/modules/connections/repositories/connection.repository';
import { handleRequest } from 'src/utils/response';

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
	const app = await getApplication();

	return handleRequest(app, { event, context }, async () => {
		const logger = app.get(RequestLogger);
		logger.debug('Disconnection event', { event });

		const connectionRepository = app.get(ConnectionRepository);
		await connectionRepository.destroyConnection(
			event.requestContext.connectionId!,
			event.requestContext.authorizer?.principalId
		);
	});
};
