import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/services/message.repository';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRepository } from 'src/modules/users/repositories';

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
		private readonly userRepository: UserRepository
	) {}

	async execute(command: ListMessagesCommand) {
		this.logger.info('List group messages', { command });

		const { messages, lastEvaluatedKey } = await this.messageRepository.listMessages(
			command.groupId,
			command.lastEvaluatedKey
		);

		return {
			messages: await Promise.all(
				messages.map(async (message) => ({
					...message,
					user: await this.userRepository.load({ id: message.userId }),
				}))
			),
			lastEvaluatedKey,
		};
	}
}
