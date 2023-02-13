import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/repositories/message.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { VideoCallRepository } from 'src/modules/video-call/repositories';
import { GroupUserRepository } from 'src/modules/groups/repositories';

@Command('video-call:join')
export class JoinVideoCallCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(JoinVideoCallCommand)
export class JoinVideoCallHandler implements ICommandHandler<JoinVideoCallCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly videoCallRepository: VideoCallRepository,
		private readonly messageRepository: MessageRepository,
		private readonly groupUserRepository: GroupUserRepository
	) {}

	async execute(command: JoinVideoCallCommand) {
		this.logger.info('Create group message', { command });

		await this.groupUserRepository.checkGroupUser(command.groupId, command.context.userId);

		await this.videoCallRepository.findOrCreateNewVideoCall(command.groupId, command.context.userId);
	}
}
