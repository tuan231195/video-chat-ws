import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { GroupModule } from 'src/modules/groups/group.module';
import { VideoCallService } from 'src/modules/video-call-handlers/services';
import { MessageModule } from 'src/modules/messages/message.module';
import { UserModule } from 'src/modules/users/user.module';
import { ConnectionModule } from 'src/modules/connections/connection.module';
import { VideoCallModule } from '../video-call/video-call.module';
import { JoinVideoCallHandler, LeaveVideoCallHandler, ListVideoCallUsersHandler } from './services/commands';

@Module({
	imports: [DynamoModule, CoreModule, GroupModule, VideoCallModule, UserModule, ConnectionModule, MessageModule],
	providers: [JoinVideoCallHandler, LeaveVideoCallHandler, ListVideoCallUsersHandler, VideoCallService],
	exports: [],
})
export class VideoCallHandlersModule {}
