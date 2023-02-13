import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { ConnectionModule } from 'src/modules/connections/connection.module';
import { CreateMessageHandler, ListMessagesHandler } from 'src/modules/message-handlers/services/commands';
import { MessageModule } from 'src/modules/messages/message.module';
import { GroupModule } from 'src/modules/groups/group.module';

@Module({
	imports: [DynamoModule, CoreModule, ConnectionModule, MessageModule, GroupModule],
	providers: [ListMessagesHandler, CreateMessageHandler],
	exports: [],
})
export class MessageHandlersModule {}
