import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/repositories/message.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GroupRepository, GroupUserRepository } from 'src/modules/groups/repositories';

@Command('messages:list')
export class ListMessagesCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;

	@IsOptional()
	lastEvaluatedKey?: any;
}

@CommandHandler(ListMessagesCommand)
export class ListMessagesHandler implements ICommandHandler<ListMessagesCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly messageRepository: MessageRepository,
		private readonly groupRepository: GroupRepository,
		private readonly groupUserRepository: GroupUserRepository
	) {}

	async execute(command: ListMessagesCommand) {
		this.logger.info('List group messages', { command });

		await this.groupUserRepository.checkGroupUser(command.groupId, command.context.userId);

		await this.groupUserRepository.upsert(
			{ groupId: command.groupId, userId: command.context.userId },
			{
				lastAccess: new Date().toISOString(),
			}
		);

		const { items, lastEvaluatedKey } = await this.messageRepository.listMessages(
			command.groupId,
			command.lastEvaluatedKey
		);

		return {
			messages: await Promise.all(items.map(async (message) => this.messageRepository.loadDetails(message))),
			lastEvaluatedKey,
		};
	}
}
