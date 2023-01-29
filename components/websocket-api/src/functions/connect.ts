import 'reflect-metadata';
import { APIGatewayProxyWithLambdaAuthorizerEvent, Context } from 'aws-lambda';
import { getApplication } from 'src/app';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { ConnectionRepository } from '../modules/connections/repositories';
import { handleRequest } from '../utils/response';

export const handler = async (event: APIGatewayProxyWithLambdaAuthorizerEvent<any>, context: Context) => {
	const app = await getApplication();

	return handleRequest(app, { event, context }, async () => {
		const logger = app.get(RequestLogger);
		logger.debug('Connection event', { event });

		const connectionRepository = app.get(ConnectionRepository);
		await connectionRepository.createConnection(
			event.requestContext.connectionId!,
			event.requestContext.authorizer.principalId
		);
	});
};
