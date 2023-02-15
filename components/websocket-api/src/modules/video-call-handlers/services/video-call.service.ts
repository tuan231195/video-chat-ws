import { Injectable } from '@nestjs/common';
import { GroupRepository } from 'src/modules/groups/repositories';
import { MessageRepository } from 'src/modules/messages/repositories';
import { UserRepository } from 'src/modules/users/repositories';
import { ConnectionService } from 'src/modules/connections/repositories/connection.service';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { VideoCallUserRepository } from 'src/modules/video-call/repositories/video-call-user.repository';
import { VideoCallUserEntity } from 'src/modules/video-call/domains';

interface VideoCallEvent {
	action: 'video-call:user-left' | 'video-call:user-joined';
	result: {
		videoCallUser: VideoCallUserEntity;
	};
}
@Injectable()
export class VideoCallService {
	constructor(
		private readonly videoCallUserRepository: VideoCallUserRepository,
		private readonly groupRepository: GroupRepository,
		private readonly messageRepository: MessageRepository,
		private readonly userRepository: UserRepository,
		private readonly connectionService: ConnectionService,
		private readonly logger: RequestLogger
	) {}

	async broadcastEvent(videoCallId: string, videoCallEvent: VideoCallEvent) {
		const videoCallUsers = await this.videoCallUserRepository.queryAll({
			key: {
				videoCallId,
			},
		});

		await Promise.all(
			videoCallUsers.map(async ({ connectionId, userId }) => {
				await this.connectionService.postToConnection(connectionId, userId, videoCallEvent);
			})
		);
	}
}
