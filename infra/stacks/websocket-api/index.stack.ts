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
	const {
		connectionTable,
		messageTable,
		groupTable,
		userTable,
		groupUsersTable,
		videoCallTable,
		videoCallUserTable,
	} = use(RootStack);

	const connectionsTableConfig = new Config.Parameter(stack, 'CONNECTIONS_TABLE', {
		value: connectionTable.tableName,
	});

	const usersTableConfig = new Config.Parameter(stack, 'USERS_TABLE', {
		value: userTable.tableName,
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

	const videoCallTableConfig = new Config.Parameter(stack, 'VIDEO_CALL_TABLE', {
		value: videoCallTable.tableName,
	});

	const videoCallUsersTableConfig = new Config.Parameter(stack, 'VIDEO_CALL_USERS_TABLE', {
		value: videoCallUserTable.tableName,
	});

	const jwksConfig = new Config.Parameter(stack, 'JWKS_ENDPOINT', {
		value: process.env.JWKS_ENDPOINT!,
	});

	const bindingConstructs = [
		connectionsTableConfig,
		messagesTableConfig,
		groupTableConfig,
		usersTableConfig,
		groupUsersTableConfig,
		groupTable,
		userTable,
		groupUsersTable,
		messageTable,
		connectionTable,
		videoCallTable,
		videoCallUserTable,
		videoCallTableConfig,
		videoCallUsersTableConfig,
		jwksConfig,
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
