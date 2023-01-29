import 'reflect-metadata';
import { NestjsBootstrapModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CommandModule } from 'src/modules/command/command.module';
import { GroupModule } from 'src/modules/groups/group.module';
import { MessageModule } from 'src/modules/messages/message.module';
import { ConnectionModule } from './modules/connections/connection.module';
import { config } from './config';

const { version } = require('../package.json');

@NestjsBootstrapModule({
	bootstrapOptions: {
		version,
		name: 'websocket-api',
		config,
	},
	imports: [DynamoModule, ConnectionModule, CommandModule, GroupModule, MessageModule],
})
export class AppModule {}
