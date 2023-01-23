import { Config, StackContext, use, WebSocketApi } from '@serverless-stack/resources';
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

	const bindingConstructs = [connectionsTableConfig, connectionTable];

	const api = new WebSocketApi(stack, 'websocket-api', {
		routes: {
			$connect: 'connect.handler',
			$disconnect: 'disconnect.handler',
			$default: 'sendMessage.handler',
		},
		accessLog: true,
	});
	api.bind(bindingConstructs);

	stack.addOutputs({
		WebsocketApiUrl: api.url,
	});
	return api;
}
