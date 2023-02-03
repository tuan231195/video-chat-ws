import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { Message } from 'src/modules/messages/domains/entities/message';
import { newId } from 'src/utils/id';
import { MessageEntity } from 'src/modules/messages/entities';

@Injectable()
export class MessageRepository extends BaseRepository {
	private readonly messagesTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		const table = config.get('MESSAGES_TABLE')!;
		super(dynamodbService, table, [['id']]);
		this.messagesTable = table;
	}

	createMessage(groupId: string, userId: string, message: Message): Promise<MessageEntity> {
		this.logger.info(`New message for group ${groupId}`, {
			message,
		});
		return this.dynamodbService.putItem(this.messagesTable, {
			...message,
			id: newId(),
			groupId,
			userId,
			createdAt: new Date().toISOString(),
		}) as Promise<MessageEntity>;
	}

	async listMessages(
		groupId: string,
		lastEvaluatedKey?: any
	): Promise<{ messages: MessageEntity[]; lastEvaluatedKey: any }> {
		const { Items = [], LastEvaluatedKey } = await this.dynamodbService.query({
			tableName: this.messagesTable,
			limit: 50,
			indexName: 'group_id_index',
			key: {
				groupId,
			},
			...(lastEvaluatedKey && { lastEvaluatedKey }),
		});
		return {
			messages: Items as MessageEntity[],
			lastEvaluatedKey: LastEvaluatedKey,
		};
	}

	deleteMessage(messageId: string) {
		this.logger.info(`Delete message ${messageId}`);
		return this.dynamodbService.destroyItem(this.messagesTable, {
			id: messageId,
		});
	}
}
