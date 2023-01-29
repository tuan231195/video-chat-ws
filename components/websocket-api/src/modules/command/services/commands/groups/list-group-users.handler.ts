import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';

@Command('group-users:list')
export class ListGroupUsersCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(ListGroupUsersCommand)
export class ListGroupUsersHandler implements ICommandHandler<ListGroupUsersCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: ListGroupUsersCommand) {
		return this.groupRepository.getGroupUsers(command.groupId);
	}
}
