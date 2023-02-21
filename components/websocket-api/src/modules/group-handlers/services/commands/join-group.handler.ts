import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { GroupRepository, GroupUserRepository } from 'src/modules/groups/repositories';
import { NotFoundException } from '@nestjs/common';
import { ErrorCodes } from 'src/utils/error-codes';

@Command('group:join')
export class JoinGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(JoinGroupCommand)
export class JoinGroupHandler implements ICommandHandler<JoinGroupCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly groupUserRepository: GroupUserRepository,
		private readonly groupRepository: GroupRepository
	) {}

	async execute(command: JoinGroupCommand) {
		this.logger.info('Join group', { command });
		const group = await this.groupUserRepository.get({
			id: command.groupId,
		});
		if (!group) {
			throw new NotFoundException({
				code: ErrorCodes.GROUP_NOT_FOUND,
				message: 'Group not found',
			});
		}
		return this.groupUserRepository.joinGroup(command.groupId, command.context.userId);
	}
}
