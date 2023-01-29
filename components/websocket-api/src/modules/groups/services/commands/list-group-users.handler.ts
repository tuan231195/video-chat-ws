import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { ListGroupUsersCommand } from 'src/modules/groups/domains/commands';
import { GroupRepository } from 'src/modules/groups/services/group.repository';

@CommandHandler(ListGroupUsersCommand)
export class ListGroupUsersHandler implements ICommandHandler<ListGroupUsersCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: ListGroupUsersCommand) {
		return this.groupRepository.getGroupUsers(command.groupId);
	}
}
