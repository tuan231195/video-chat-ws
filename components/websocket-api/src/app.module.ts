import 'reflect-metadata';
import { NestjsBootstrapModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { config } from './config';

const { version } = require('../package.json');

@NestjsBootstrapModule({
	bootstrapOptions: {
		version,
		name: 'websocket-api',
		config,
	},
	imports: [DynamoModule, WebsocketModule],
})
export class AppModule {}
