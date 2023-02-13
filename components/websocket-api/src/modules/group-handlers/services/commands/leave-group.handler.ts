import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { GroupUserRepository } from 'src/modules/groups/repositories';

@Command('group:leave')
export class LeaveGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(LeaveGroupCommand)
export class LeaveGroupHandler implements ICommandHandler<LeaveGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupUserRepository: GroupUserRepository) {}

	async execute(command: LeaveGroupCommand) {
		this.logger.info('Leave group', { command });
		return this.groupUserRepository.delete({ groupId: command.groupId, userId: command.context.userId });
	}
}
