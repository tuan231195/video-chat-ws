import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { GroupRepository } from 'src/modules/groups/repositories/group.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { newId } from 'src/utils/id';
import { GroupUserRepository } from 'src/modules/groups/repositories';
import { MessageRepository } from 'src/modules/messages/repositories';

@Command('group:create')
export class CreateGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	name!: string;
}

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly groupRepository: GroupRepository,
		private readonly groupUserRepository: GroupUserRepository,
		private readonly messageRepository: MessageRepository
	) {}

	async execute(command: CreateGroupCommand) {
		this.logger.info('Create group', { command });
		const group = await this.groupRepository.save({
			name: command.name,
			creator: command.context.userId,
			createdAt: new Date().toISOString(),
			id: newId(),
		});

		const { id: groupId } = group;
		const userGroup = await this.groupUserRepository.joinGroup(groupId, command.context.userId);

		return {
			...userGroup,
			group: await this.groupRepository.loadDetails(userGroup.groupId, {
				messageRepository: this.messageRepository,
			}),
		};
	}
}
