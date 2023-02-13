import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { GroupUserRepository } from 'src/modules/groups/repositories';

@Command('group:join')
export class JoinGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}

@CommandHandler(JoinGroupCommand)
export class JoinGroupHandler implements ICommandHandler<JoinGroupCommand> {
	constructor(private readonly logger: RequestLogger, private readonly groupUserRepository: GroupUserRepository) {}

	async execute(command: JoinGroupCommand) {
		this.logger.info('Join group', { command });
		return this.groupUserRepository.joinGroup(command.groupId, command.context.userId);
	}
}
