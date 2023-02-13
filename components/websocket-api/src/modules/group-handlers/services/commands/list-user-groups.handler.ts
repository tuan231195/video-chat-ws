import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { GroupRepository, GroupUserRepository } from 'src/modules/groups/repositories';
import { MessageRepository } from 'src/modules/messages/repositories';

@Command('user-groups:list')
export class ListUserGroupsCommand extends BaseCommand {}
@CommandHandler(ListUserGroupsCommand)
export class ListUserGroupsHandler implements ICommandHandler<ListUserGroupsCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly groupUserRepository: GroupUserRepository,
		private readonly groupRepository: GroupRepository,
		private readonly messageRepository: MessageRepository
	) {}

	async execute(command: ListUserGroupsCommand) {
		const userGroups = await this.groupUserRepository.getUserGroups(command.context.userId);

		return Promise.all(
			userGroups.map(async (userGroup) => ({
				...userGroup,
				group: await this.groupRepository.loadDetails(userGroup.groupId, {
					messageRepository: this.messageRepository,
				}),
			}))
		);
	}
}
