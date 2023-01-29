import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';

@Command('user-groups:list')
export class ListUserGroupsCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	userId!: string;
}
@CommandHandler(ListUserGroupsCommand)
export class ListUserGroupsHandler implements ICommandHandler<ListUserGroupsCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: ListUserGroupsCommand) {
		const userGroups = await this.groupRepository.getUserGroups(command.userId);

		return Promise.all(
			userGroups.map(async (userGroup) => ({
				...userGroup,
				group: await this.groupRepository.load({ id: userGroup.groupId }),
			}))
		);
	}
}
