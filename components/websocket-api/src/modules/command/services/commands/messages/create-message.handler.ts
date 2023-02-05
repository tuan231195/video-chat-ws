import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { MessageRepository } from 'src/modules/messages/services/message.repository';
import { MessageService } from 'src/modules/messages/services/message.service';
import { BaseCommand, Command } from 'src/modules/command/domains';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Message } from 'src/modules/messages/domains/entities/message';
import { GroupRepository } from 'src/modules/groups/services';
import { MessageHelper } from 'src/modules/command/services/commands/messages/message.helper';
import { GroupHelper } from 'src/modules/command/services/commands/groups/group.helper';

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
		private readonly groupRepository: GroupRepository,
		private readonly messageService: MessageService,
		private readonly messageHelper: MessageHelper,
		private readonly groupHelper: GroupHelper
	) {}

	async execute(command: CreateMessageCommand) {
		this.logger.info('Create group message', { command });

		await this.groupHelper.checkGroupUser(command.groupId, command.context.userId);

		const message = await this.messageRepository.createMessage(
			command.groupId,
			command.context.userId,
			command.message
		);

		await this.groupRepository.updateGroupUser(command.groupId, command.context.userId, {
			lastAccess: new Date().toISOString(),
		});

		await this.groupRepository.updateGroup(command.groupId, {
			lastMessageId: message.id,
		});
		const messageDetails = await this.messageHelper.loadDetails(message);

		await this.messageService.broadcastMessage(messageDetails!);

		return messageDetails;
	}
}
