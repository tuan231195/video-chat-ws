import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CommandDispatcher } from 'src/modules/command/services';
import { CqrsModule } from '@nestjs/cqrs';
import {
	CreateGroupHandler,
	JoinGroupHandler,
	LeaveGroupHandler,
	ListGroupUsersHandler,
	ListUserGroupsHandler,
} from 'src/modules/command/services/commands/groups';
import { CreateMessageHandler } from 'src/modules/command/services/commands/messages';
import { GroupModule } from 'src/modules/groups/group.module';
import { MessageModule } from 'src/modules/messages/message.module';

@Module({
	imports: [DynamoModule, CoreModule, CqrsModule, GroupModule, MessageModule],
	providers: [
		CommandDispatcher,
		CreateGroupHandler,
		JoinGroupHandler,
		LeaveGroupHandler,
		ListGroupUsersHandler,
		ListUserGroupsHandler,
		CreateMessageHandler,
	],
	exports: [CommandDispatcher],
})
export class CommandModule {}
