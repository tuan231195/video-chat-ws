import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/services/message.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRepository } from 'src/modules/users/repositories';
import { MessageHelper } from 'src/modules/command/services/commands/messages/message.helper';
import { GroupRepository } from 'src/modules/groups/services';
import { GroupHelper } from 'src/modules/command/services/commands/groups/group.helper';

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
		private readonly userRepository: UserRepository,
		private readonly messageHelper: MessageHelper,
		private readonly groupHelper: GroupHelper
	) {}

	async execute(command: ListMessagesCommand) {
		this.logger.info('List group messages', { command });

		await this.groupHelper.checkGroupUser(command.groupId, command.context.userId);

		const { messages, lastEvaluatedKey } = await this.messageRepository.listMessages(
			command.groupId,
			command.lastEvaluatedKey
		);

		return {
			messages: await Promise.all(messages.map(async (message) => this.messageHelper.loadDetails(message))),
			lastEvaluatedKey,
		};
	}
}
