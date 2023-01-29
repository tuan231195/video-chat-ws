import { Inject, Injectable } from '@nestjs/common';
import { DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { Message } from 'src/modules/messages/domains/message';
import { newId } from 'src/utils/id';

@Injectable()
export class MessageRepository {
	private readonly messagesTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		this.messagesTable = this.config.get('MESSAGES_TABLE')!;
	}

	createMessage(groupId: string, userId: string, message: Message) {
		this.logger.info(`New message for group ${groupId}`, {
			message,
		});
		return this.dynamodbService.putItem(this.messagesTable, {
			...message,
			id: newId(),
			groupId,
			userId,
			createdAt: new Date(),
		});
	}

	deleteMessage(messageId: string) {
		this.logger.info(`Delete message ${messageId}`);
		return this.dynamodbService.destroyItem(this.messagesTable, {
			id: messageId,
		});
	}
}
