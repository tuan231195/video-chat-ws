import { App } from '@serverless-stack/resources';
import { IndexStack } from './index.stack';
import { IndexStack as WebsocketApiStack } from './websocket-api/index.stack';
import { IndexStack as ChatAppStack } from './chat-app/index.stack';

export default function bootstrap(app: App) {
	app.setDefaultFunctionProps({
		runtime: 'nodejs16.x',
		environment: {
			NODE_OPTIONS: '--enable-source-maps',
		},
		bundle: {
			esbuildConfig: {
				keepNames: true,
			},
			format: 'esm',
			sourcemap: true,
			externalModules: [
				'@nestjs/websockets',
				'@nestjs/microservices',
				'point-of-view',
				'@fastify/view',
				'class-transformer/storage',
				'swagger-ui-express',
				'regenerator-runtime',
				'@nestjs/platform-express',
				'@nestjs/sequelize',
				'cache-manager',
				'@nestjs/mongoose',
				'@nestjs/typeorm',
				'@mikro-orm/core',
			],
		},
	});
	app.stack(IndexStack, {
		id: 'root-stack',
	})
		.stack(WebsocketApiStack, {
			id: 'websocket-api-stack',
		})
		.stack(ChatAppStack, {
			id: 'chat-app-stack',
		});
}
