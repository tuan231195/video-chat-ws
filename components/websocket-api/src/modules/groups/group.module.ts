import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CreateGroupHandler, JoinGroupHandler, LeaveGroupHandler } from 'src/modules/groups/services';
import { GroupRepository } from 'src/modules/groups/services/group.repository';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [CreateGroupHandler, JoinGroupHandler, LeaveGroupHandler, GroupRepository],
	exports: [CreateGroupHandler],
})
export class GroupModule {}
