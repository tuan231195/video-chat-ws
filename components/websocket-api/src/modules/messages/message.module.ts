import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { MessageRepository } from 'src/modules/messages/services/message.repository';
import { GroupModule } from 'src/modules/groups/group.module';
import { MessageService } from 'src/modules/messages/services/message.service';
import { CreateMessageHandler } from './services';

@Module({
	imports: [DynamoModule, CoreModule, GroupModule],
	providers: [CreateMessageHandler, MessageRepository, MessageService],
	exports: [CreateMessageHandler],
})
export class MessageModule {}
