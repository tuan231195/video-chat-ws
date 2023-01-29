import 'reflect-metadata';
import { getApplication } from 'src/app';
import { CONFIG_TOKEN, RequestLogger, runInContext } from '@vdtn359/nestjs-bootstrap';
import { verify } from 'jsonwebtoken';
import { Config } from 'src/config';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';

const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string) => {
	const authResponse: any = {};
	authResponse.principalId = principalId;
	if (effect && resource) {
		authResponse.policyDocument = {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: effect,
					Resource: resource,
				},
			],
		};
	}
	authResponse.context = {
		userId: principalId,
	};
	return authResponse;
};

const generateAllow = (principalId: string, resource: string) => generatePolicy(principalId, 'Allow', resource);

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
	const app = await getApplication();

	return runInContext(app, { traceId: event.requestContext.connectionId }, async () => {
		const logger = app.get(RequestLogger);
		const config: Config = app.get(CONFIG_TOKEN);
		const secret = config.get('JWT_SECRET')!;
		logger.debug('Authorizer event', event);

		const jwt = event.headers?.authorization ?? event.queryStringParameters?.authorization;
		let userId: string | undefined;
		if (jwt) {
			try {
				({ sub: userId } = verify(jwt, secret) as any);
			} catch (err) {
				logger.warn('Unauthorized request', {
					jwt,
					err,
				});
			}
		}
		if (!userId) {
			throw new Error('Unauthorized');
		}

		return generateAllow(userId, event.methodArn);
	});
};
