import 'reflect-metadata';
import { getApplication } from 'src/app';
import { CONFIG_TOKEN, RequestLogger, runInContext } from '@vdtn359/nestjs-bootstrap';
import { GetPublicKeyOrSecret, verify } from 'jsonwebtoken';
import type { Config } from 'src/config';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { User } from 'src/modules/users/domains';
import jwksClient, { JwksClient } from 'jwks-rsa';
import * as util from 'util';
import { generateAvatar } from 'src/utils/avatar';

const verifyAsync: any = util.promisify(verify);

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

function keyRetrieval(client: JwksClient): GetPublicKeyOrSecret {
	return async (header, callback) => {
		try {
			const key = await client.getSigningKey(header.kid);
			callback(null, key.getPublicKey());
		} catch (err: any) {
			callback(err);
		}
	};
}

const generateAllow = (user: User, resource: string) => generatePolicy(user, 'Allow', resource);

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
	const app = await getApplication();
	const config: Config = app.get(CONFIG_TOKEN);

	const client = jwksClient({
		jwksUri: config.get('JWKS_ENDPOINT')!,
	});

	return runInContext(app, { traceId: event.requestContext.connectionId }, async () => {
		const logger = app.get(RequestLogger);
		logger.debug('Authorizer event', event);

		const jwt = event.headers?.authorization ?? event.queryStringParameters?.authorization;
		let user: User | undefined;
		if (jwt) {
			try {
				const payload: Record<string, any> = await verifyAsync(jwt, keyRetrieval(client));
				user = {
					id: payload.sub,
					name: payload.name,
					email: payload.email,
					avatar: payload.picture ?? generateAvatar(payload.sub),
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
