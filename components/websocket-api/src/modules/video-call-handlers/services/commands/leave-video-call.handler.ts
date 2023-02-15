import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { VideoCallRepository } from 'src/modules/video-call/repositories';
import { GroupUserRepository } from 'src/modules/groups/repositories';
import { VideoCallUserRepository } from 'src/modules/video-call/repositories/video-call-user.repository';
import { VideoCallService } from '../video-call.service';

@Command('video-call:leave')
export class LeaveVideoCallCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	videoCallId!: string;

	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(LeaveVideoCallCommand)
export class LeaveVideoCallHandler implements ICommandHandler<LeaveVideoCallCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly videoCallRepository: VideoCallRepository,
		private readonly videoCallUserRepository: VideoCallUserRepository,

		private readonly videoCallService: VideoCallService,
		private readonly groupUserRepository: GroupUserRepository
	) {}

	async execute(command: LeaveVideoCallCommand) {
		this.logger.info('Leaving video call', { command });

		await this.groupUserRepository.checkGroupUser(command.groupId, command.context.userId);

		const videoCallUser = await this.videoCallUserRepository.leftVideoCall(
			command.videoCallId,
			command.context.userId
		);

		const userWithDetails = await this.videoCallUserRepository.loadDetails(videoCallUser);

		await this.videoCallService.broadcastEvent(command.videoCallId, {
			action: 'video-call:user-left',
			result: {
				videoCallUser: userWithDetails,
			},
		});

		return userWithDetails;
	}
}
