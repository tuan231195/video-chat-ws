import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/services/message.repository';
import { MessageService } from 'src/modules/messages/services/message.service';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Message } from 'src/modules/messages/domains/entities/message';

@Command('message:create')
export class CreateMessageCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;

	@IsDefined()
	@ValidateNested()
	@Type(() => Message)
	message!: Message;
}

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
		await this.messageService.broadcastMessage(message, {
			exclude: command.context.userId,
		});

		return message;
	}
}
