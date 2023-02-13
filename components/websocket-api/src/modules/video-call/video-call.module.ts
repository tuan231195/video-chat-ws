import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { VideoCallRepository } from 'src/modules/video-call/repositories';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [VideoCallRepository],
	exports: [VideoCallRepository],
})
export class VideoCallModule {}
