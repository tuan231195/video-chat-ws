import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { ListUserGroupsCommand } from 'src/modules/groups/domains/commands';
import { GroupRepository } from 'src/modules/groups/services/group.repository';

@CommandHandler(ListUserGroupsCommand)
export class ListUserGroupsHandler implements ICommandHandler<ListUserGroupsCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: ListUserGroupsCommand) {
		return this.groupRepository.getUserGroups(command.userId);
	}
}
