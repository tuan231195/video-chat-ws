import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { JoinGroupCommand } from 'src/modules/groups/domains/commands';
import { GroupRepository } from 'src/modules/groups/services/group.repository';

@CommandHandler(JoinGroupCommand)
export class JoinGroupHandler implements ICommandHandler<JoinGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: JoinGroupCommand) {
		this.logger.info('Join group', { command });
		return this.groupRepository.joinGroup(command.groupId, command.context.userId, command.context.connectionId);
	}
}
