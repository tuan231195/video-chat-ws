import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { CreateGroupCommand } from 'src/modules/groups/domains/commands';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { newId } from 'src/utils/id';

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: CreateGroupCommand) {
		this.logger.info('Create group', { command });
		const group = await this.groupRepository.createGroup({
			name: command.name,
			id: newId(),
		});

		const { id: groupId } = group;
		await this.groupRepository.joinGroup(groupId, command.context.userId, command.context.connectionId);

		return group;
	}
}
