import 'reflect-metadata';
import { getApplication } from 'src/app';
import { CONFIG_TOKEN, RequestLogger, runInContext } from '@vdtn359/nestjs-bootstrap';
import { verify } from 'jsonwebtoken';
import { Config } from 'src/config';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { User } from 'src/modules/users/domains';

const generatePolicy = (user: User, effect: 'Allow' | 'Deny', resource: string) => {
	const authResponse: any = {};
	authResponse.principalId = user.id;
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
		user: JSON.stringify(user),
	};
	return authResponse;
};

const generateAllow = (user: User, resource: string) => generatePolicy(user, 'Allow', resource);

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
	const app = await getApplication();

	return runInContext(app, { traceId: event.requestContext.connectionId }, async () => {
		const logger = app.get(RequestLogger);
		const config: Config = app.get(CONFIG_TOKEN);
		const secret = config.get('JWT_SECRET')!;
		logger.debug('Authorizer event', event);

		const jwt = event.headers?.authorization ?? event.queryStringParameters?.authorization;
		let user: User | undefined;
		if (jwt) {
			try {
				const payload: Record<string, any> = verify(jwt, secret) as any;
				user = {
					id: payload.sub,
					name: payload.name,
				};
			} catch (err) {
				logger.warn('Unauthorized request', {
					jwt,
					err,
				});
			}
		}
		if (!user) {
			throw new Error('Unauthorized');
		}

		return generateAllow(user, event.methodArn);
	});
};
