import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CreateGroupHandler, JoinGroupHandler, LeaveGroupHandler } from 'src/modules/groups/services';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { ListUserGroupsHandler } from 'src/modules/groups/services/commands/list-user-groups.handler';
import { ListGroupUsersHandler } from 'src/modules/groups/services/commands/list-group-users.handler';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [
		CreateGroupHandler,
		JoinGroupHandler,
		LeaveGroupHandler,
		ListGroupUsersHandler,
		ListUserGroupsHandler,
		GroupRepository,
	],
	exports: [CreateGroupHandler, GroupRepository],
})
export class GroupModule {}
