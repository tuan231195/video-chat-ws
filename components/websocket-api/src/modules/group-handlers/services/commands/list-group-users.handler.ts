import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { GroupUserRepository } from 'src/modules/groups/repositories/group-user.repository';

@Command('group-users:list')
export class ListGroupUsersCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(ListGroupUsersCommand)
export class ListGroupUsersHandler implements ICommandHandler<ListGroupUsersCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupUserRepository: GroupUserRepository) {}

	async execute(command: ListGroupUsersCommand) {
		return this.groupUserRepository.getGroupUsers(command.groupId);
	}
}
