import 'reflect-metadata';
import { NestjsBootstrapModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CommandModule } from 'src/modules/command/command.module';
import { ConnectionModule } from './modules/connections/connection.module';
import { config } from './config';

const { version } = require('../package.json');

@NestjsBootstrapModule({
	bootstrapOptions: {
		version,
		name: 'websocket-api',
		config,
	},
	imports: [DynamoModule, ConnectionModule, CommandModule],
})
export class AppModule {}
