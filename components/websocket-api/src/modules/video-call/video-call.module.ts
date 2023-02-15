import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { VideoCallRepository, VideoCallUserRepository } from 'src/modules/video-call/repositories';
import { UserModule } from 'src/modules/users/user.module';

@Module({
	imports: [DynamoModule, CoreModule, UserModule],
	providers: [VideoCallRepository, VideoCallUserRepository],
	exports: [VideoCallRepository, VideoCallUserRepository],
})
export class VideoCallModule {}
