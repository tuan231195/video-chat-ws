import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/repositories/message.repository';
import { MessageService } from 'src/modules/messages/services/message.service';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';
import { GroupUserRepository } from 'src/modules/groups/repositories';

@Command('message:create')
export class CreateMessageCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;

	@IsNotEmpty()
	@IsString()
	message!: string;
}

@CommandHandler(CreateMessageCommand)
export class CreateMessageHandler implements ICommandHandler<CreateMessageCommand> {
	constructor(
		private readonly logger: RequestLogger,
		private readonly messageRepository: MessageRepository,
		private readonly groupUserRepository: GroupUserRepository,
		private readonly messageService: MessageService
	) {}

	async execute(command: CreateMessageCommand) {
		this.logger.info('Create group message', { command });

		await this.groupUserRepository.checkGroupUser(command.groupId, command.context.userId);

		const message = await this.messageService.createMessage({
			userId: command.context.userId,
			groupId: command.groupId,
			type: 'message',
			body: command.message,
		});
		const messageDetails = await this.messageRepository.loadDetails(message);

		await this.messageService.broadcastMessage(messageDetails!);

		return messageDetails;
	}
}
