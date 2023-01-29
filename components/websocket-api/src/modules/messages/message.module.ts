import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { MessageRepository, MessageService } from 'src/modules/messages/services';
import { GroupModule } from 'src/modules/groups/group.module';

@Module({
	imports: [DynamoModule, CoreModule, GroupModule],
	providers: [MessageRepository, MessageService],
	exports: [MessageRepository, MessageService],
})
export class MessageModule {}
