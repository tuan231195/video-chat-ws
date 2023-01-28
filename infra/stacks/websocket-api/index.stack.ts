import { Config, StackContext, use, WebSocketApi, Function } from '@serverless-stack/resources';
import { config as loadConfig } from 'dotenv-flow';
import { IndexStack as RootStack } from '../index.stack';

export function IndexStack({ stack }: StackContext) {
	loadConfig({
		path: 'components/websocket-api',
	});
	stack.setDefaultFunctionProps({
		srcPath: 'components/websocket-api/dist',
	});
	const { connectionTable } = use(RootStack);

	const connectionsTableConfig = new Config.Parameter(stack, 'CONNECTIONS_TABLE', {
		value: connectionTable.tableName,
	});

	const jwtSecret = new Config.Secret(stack, 'JWT_SECRET');

	const bindingConstructs = [connectionsTableConfig, connectionTable, jwtSecret];

	const authorizerFunction = new Function(stack, 'authorizer', {
		handler: 'functions/authorizer.handler',
	});
	const api = new WebSocketApi(stack, 'websocket-api', {
		routes: {
			$connect: 'functions/connect.handler',
			$disconnect: 'functions/disconnect.handler',
			$default: 'functions/sendMessage.handler',
		},
		authorizer: {
			type: 'lambda',
			function: authorizerFunction,
		},
		accessLog: true,
	});
	authorizerFunction.bind(bindingConstructs);
	api.bind(bindingConstructs);

	stack.addOutputs({
		WebsocketApiUrl: api.url,
	});
	return api;
}
