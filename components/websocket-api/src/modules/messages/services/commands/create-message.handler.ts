import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { CreateMessageCommand } from 'src/modules/messages/domains/commands';
import { MessageRepository } from 'src/modules/messages/services/message.repository';
import { MessageService } from 'src/modules/messages/services/message.service';

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly messageRepository: MessageRepository,
		private readonly messageService: MessageService
	) {}

	async execute(command: CreateMessageCommand) {
		this.logger.info('Create group message', { command });

		const message = await this.messageRepository.createMessage(
			command.groupId,
			command.context.userId,
			command.message
		);
		await this.messageService.broadcastMessage(command, {
			exclude: command.context.userId,
		});

		return message;
	}
}
