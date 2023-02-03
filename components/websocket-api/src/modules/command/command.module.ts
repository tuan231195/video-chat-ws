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
import { CreateMessageHandler, ListMessagesHandler } from 'src/modules/command/services/commands/messages';
import { GroupModule } from 'src/modules/groups/group.module';
import { MessageModule } from 'src/modules/messages/message.module';
import { UserModule } from 'src/modules/users/user.module';
import { GroupHelper } from 'src/modules/command/services/commands/groups/group.helper';
import { MessageHelper } from 'src/modules/command/services/commands/messages/message.helper';

@Module({
	imports: [DynamoModule, CoreModule, CqrsModule, GroupModule, MessageModule, UserModule],
	providers: [
		CommandDispatcher,
		CreateGroupHandler,
		JoinGroupHandler,
		LeaveGroupHandler,
		ListGroupUsersHandler,
		ListMessagesHandler,
		ListUserGroupsHandler,
		CreateMessageHandler,
		GroupHelper,
		MessageHelper,
	],
	exports: [CommandDispatcher],
})
export class CommandModule {}
