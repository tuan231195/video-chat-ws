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
	const { connectionTable, messageTable, groupTable, groupUsersTable } = use(RootStack);

	const connectionsTableConfig = new Config.Parameter(stack, 'CONNECTIONS_TABLE', {
		value: connectionTable.tableName,
	});

	const messagesTableConfig = new Config.Parameter(stack, 'MESSAGES_TABLE', {
		value: messageTable.tableName,
	});

	const groupTableConfig = new Config.Parameter(stack, 'GROUPS_TABLE', {
		value: groupTable.tableName,
	});

	const groupUsersTableConfig = new Config.Parameter(stack, 'GROUP_USERS_TABLE', {
		value: groupUsersTable.tableName,
	});

	const jwtSecret = new Config.Secret(stack, 'JWT_SECRET');

	const bindingConstructs = [
		connectionsTableConfig,
		messagesTableConfig,
		groupTableConfig,
		groupUsersTableConfig,
		groupTable,
		groupUsersTable,
		messageTable,
		connectionTable,
		jwtSecret,
	];

	const authorizerFunction = new Function(stack, 'authorizer', {
		handler: 'functions/authorizer.handler',
	});
	const api = new WebSocketApi(stack, 'websocket-api', {
		routes: {
			$connect: 'functions/connect.handler',
			$disconnect: 'functions/disconnect.handler',
			$default: 'functions/send-message.handler',
		},
		authorizer: {
			type: 'lambda',
			function: authorizerFunction,
			identitySource: ['route.request.querystring.authorization'],
		},
		defaults: {
			function: {
				environment: {
					ENABLE_COLORIZED_LOGS: process.env.ENABLE_COLORIZED_LOGS ?? 'false',
				},
			},
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
