import { constants } from 'http2';
import { HttpException, HttpStatus, INestApplicationContext } from '@nestjs/common';
import { ErrorCodes } from 'src/utils/error-codes';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { RequestLogger, runInContext } from '@vdtn359/nestjs-bootstrap';
import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';

const JSON_CONTENT_TYPE = 'application/json';

const cachedApiGateway: Record<string, ApiGatewayManagementApi> = {};

function getApiGateway(event: APIGatewayProxyEvent) {
	const { stage, domainName } = event.requestContext;
	const domain = `https://${domainName}/${stage}`;
	if (cachedApiGateway[domain]) {
		return cachedApiGateway[domain];
	}
	cachedApiGateway[domain] = new ApiGatewayManagementApi({
		endpoint: domain,
	});
	return cachedApiGateway[domain];
}

export function response({ body = { success: true }, statusCode }: { body?: any; statusCode: number }) {
	const contentType = typeof body === 'object' ? JSON_CONTENT_TYPE : 'text/plain';
	return {
		headers: {
			'Content-Type': contentType,
			'Access-Control-Allow-Origin': '*',
		},
		statusCode,
		body: body && contentType === JSON_CONTENT_TYPE ? JSON.stringify(body) : body,
	};
}

export function error(exception: any) {
	const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

	const message = httpStatus === HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal Server Error' : exception.message;

	let errors = exception instanceof HttpException ? exception.getResponse() : message;
	if (typeof errors === 'object') {
		if (typeof errors.message === 'object') {
			errors = errors.message;
		}
	} else {
		errors = { message, code: ErrorCodes.INTERNAL_SERVER_ERROR };
	}

	if (!Array.isArray(errors)) {
		errors = [errors];
	}

	errors = errors.map((err: any) => {
		const code = err.code ?? ErrorCodes.INTERNAL_SERVER_ERROR;
		return {
			metadata: err.metadata,
			message: err.message ?? message,
			code,
		};
	});

	return { errors, status: httpStatus };
}

export function ok(body: any) {
	return response({ body, statusCode: constants.HTTP_STATUS_OK });
}

export async function handleRequest(
	app: INestApplicationContext,
	{ event, context }: { event: APIGatewayProxyEvent; context: Context },
	handler: () => Promise<any>
) {
	const { connectionId } = event.requestContext;
	const { awsRequestId: requestId } = context;
	const { principalId } = event.requestContext.authorizer ?? {};
	const { message, response: responseBody } = await runInContext(
		app,
		{ traceId: requestId, context: { userId: principalId, connectionId } },
		async () => {
			try {
				const result = await handler();
				return { message: result, response: ok(result) };
			} catch (err: any) {
				const { errors, status } = error(err);
				const errorResponse = response({ body: { errors }, statusCode: status });
				const isInternalServerError = errorResponse.statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
				const logger = app.get(RequestLogger);

				const logLevel = isInternalServerError ? 'error' : 'warn';

				logger[logLevel](`Error: ${err.message}`, {
					err,
				});
				return { response: errorResponse };
			}
		}
	);
	if (message) {
		const apiGateway = getApiGateway(event);
		await apiGateway.postToConnection({
			ConnectionId: connectionId,
			Data: Buffer.from(typeof message === 'object' ? JSON.stringify(message) : message.toString()),
		});
	}
	return responseBody;
}
