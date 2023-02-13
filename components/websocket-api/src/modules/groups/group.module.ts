import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { GroupRepository, GroupUserRepository } from 'src/modules/groups/repositories';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [GroupRepository, GroupUserRepository],
	exports: [GroupRepository, GroupUserRepository],
})
export class GroupModule {}
