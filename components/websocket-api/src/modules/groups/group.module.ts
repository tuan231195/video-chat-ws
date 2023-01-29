import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { GroupRepository } from 'src/modules/groups/services';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [GroupRepository],
	exports: [GroupRepository],
})
export class GroupModule {}
