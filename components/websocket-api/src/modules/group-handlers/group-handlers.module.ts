import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import {
	CreateGroupHandler,
	JoinGroupHandler,
	LeaveGroupHandler,
	ListGroupUsersHandler,
	ListUserGroupsHandler,
} from 'src/modules/group-handlers/services';
import { MessageModule } from 'src/modules/messages/message.module';
import { GroupModule } from 'src/modules/groups/group.module';

@Module({
	imports: [DynamoModule, CoreModule, MessageModule, GroupModule],
	providers: [CreateGroupHandler, JoinGroupHandler, LeaveGroupHandler, ListGroupUsersHandler, ListUserGroupsHandler],
	exports: [],
})
export class GroupHandlersModule {}
