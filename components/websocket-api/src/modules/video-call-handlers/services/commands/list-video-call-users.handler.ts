import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { VideoCallUserRepository } from 'src/modules/video-call/repositories/video-call-user.repository';
import { GroupUserRepository } from 'src/modules/groups/repositories';

@Command('video-call:list-users')
export class ListVideoCallUsersCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	videoCallId!: string;

	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(ListVideoCallUsersCommand)
export class ListVideoCallUsersHandler implements ICommandHandler<ListVideoCallUsersCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly videoCallUserRepository: VideoCallUserRepository,
		private readonly groupUserRepository: GroupUserRepository
	) {}

	async execute(command: ListVideoCallUsersCommand) {
		await this.groupUserRepository.checkGroupUser(command.groupId, command.context.userId);

		const items = await this.videoCallUserRepository.queryAll({
			key: { videoCallId: command.videoCallId },
		});
		const activeUsers = items.filter((item) => !item.leftAt);
		return Promise.all(activeUsers.map((item) => this.videoCallUserRepository.loadDetails(item)));
	}
}
