import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { VideoCallRepository } from 'src/modules/video-call/repositories';
import { GroupModule } from 'src/modules/groups/group.module';

@Module({
	imports: [DynamoModule, CoreModule, GroupModule],
	providers: [VideoCallRepository],
	exports: [VideoCallRepository],
})
export class VideoCallHandlersModule {}
