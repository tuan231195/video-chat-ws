import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';

@Command('group:create')
export class CreateGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	name!: string;
}

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupRepository: GroupRepository) {}

	async execute(command: CreateGroupCommand) {
		this.logger.info('Create group', { command });
		const group = await this.groupRepository.createGroup({
			name: command.name,
			creator: command.context.userId,
		});

		const { id: groupId } = group;
		await this.groupRepository.joinGroup(groupId, command.context.userId);

		return group;
	}
}
