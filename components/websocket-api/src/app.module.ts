import 'reflect-metadata';
import { NestjsBootstrapModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CommandModule } from 'src/modules/command/command.module';
import { GroupModule } from 'src/modules/groups/group.module';
import { MessageModule } from 'src/modules/messages/message.module';
import { UserModule } from 'src/modules/users/user.module';
import { GroupHandlersModule } from 'src/modules/group-handlers/group-handlers.module';
import { MessageHandlersModule } from 'src/modules/message-handlers/message-handlers.module';
import { ConnectionModule } from './modules/connections/connection.module';
import { config } from './config';

const { version } = require('../package.json');

@NestjsBootstrapModule({
	bootstrapOptions: {
		version,
		name: 'websocket-api',
		config,
	},
	imports: [
		DynamoModule,
		ConnectionModule,
		CommandModule,
		GroupModule,
		GroupHandlersModule,
		MessageModule,
		MessageHandlersModule,
		UserModule,
	],
})
export class AppModule {}
