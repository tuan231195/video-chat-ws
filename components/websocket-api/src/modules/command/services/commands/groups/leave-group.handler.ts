import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';

@Command('group:leave')
export class LeaveGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(LeaveGroupCommand)
export class LeaveGroupHandler implements ICommandHandler<LeaveGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: LeaveGroupCommand) {
		this.logger.info('Leave group', { command });
		return this.groupRepository.leaveGroup(command.groupId, command.context.userId);
	}
}
