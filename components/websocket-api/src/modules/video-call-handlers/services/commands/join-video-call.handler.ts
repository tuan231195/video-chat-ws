import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/repositories/message.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { VideoCallRepository } from 'src/modules/video-call/repositories';
import { GroupUserRepository } from 'src/modules/groups/repositories';
import { VideoCallUserRepository } from 'src/modules/video-call/repositories/video-call-user.repository';
import { VideoCallService } from 'src/modules/video-call-handlers/services/video-call.service';

@Command('video-call:join')
export class JoinVideoCallCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;

	@IsNotEmpty()
	@IsString()
	peerId!: string;
}

@CommandHandler(JoinVideoCallCommand)
export class JoinVideoCallHandler implements ICommandHandler<JoinVideoCallCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly videoCallRepository: VideoCallRepository,
		private readonly videoCallService: VideoCallService,
		private readonly videoCallUserRepository: VideoCallUserRepository,
		private readonly messageRepository: MessageRepository,
		private readonly groupUserRepository: GroupUserRepository
	) {}

	async execute(command: JoinVideoCallCommand) {
		this.logger.info('Joining video call', { command });

		await this.groupUserRepository.checkGroupUser(command.groupId, command.context.userId);

		const videoCall = await this.videoCallRepository.findOrCreateNewVideoCall(
			command.groupId,
			command.context.userId
		);

		const videoCallUser = await this.videoCallUserRepository.joinVideoCall({
			videoCallId: videoCall.id,
			userId: command.context.userId,
			peerId: command.peerId,
			connectionId: command.context.connectionId,
		});

		const userWithDetails = await this.videoCallUserRepository.loadDetails(videoCallUser);

		await this.videoCallService.broadcastEvent(videoCall.id, {
			action: 'video-call:user-joined',
			result: {
				videoCallUser: userWithDetails,
			},
		});
		return userWithDetails;
	}
}
