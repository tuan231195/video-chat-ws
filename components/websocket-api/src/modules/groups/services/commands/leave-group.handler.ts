import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { LeaveGroupCommand } from 'src/modules/groups/domains/commands';
import { GroupRepository } from 'src/modules/groups/services/group.repository';

@CommandHandler(LeaveGroupCommand)
export class LeaveGroupHandler implements ICommandHandler<LeaveGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: LeaveGroupCommand) {
		this.logger.info('Leave group', { command });
		return this.groupRepository.leaveGroup(command.groupId, command.context.userId);
	}
}
