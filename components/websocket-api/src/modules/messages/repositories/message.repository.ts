import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb';
import { CONFIG_TOKEN } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { MessageEntity } from 'src/modules/messages/domains/entities';
import { UserRepository } from 'src/modules/users/repositories';

@Injectable()
export class MessageRepository extends BaseRepository<MessageEntity> {
	private readonly messagesTable: string;

	constructor(
		readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private userRepository: UserRepository
	) {
		const table = config.get('MESSAGES_TABLE')!;
		super(dynamodbService, MessageEntity, table, [['id']]);
		this.messagesTable = table;
	}

	async loadDetails(idOrMessage: string | MessageEntity) {
		if (!idOrMessage) {
			return null;
		}
		let loadedMessage: MessageEntity | null;
		if (typeof idOrMessage === 'string') {
			loadedMessage = await this.load({ id: idOrMessage });
		} else {
			loadedMessage = idOrMessage;
		}
		if (!loadedMessage) {
			return null;
		}
		const user = await this.userRepository.load({ id: loadedMessage.userId });
		delete user.connections;
		return {
			...loadedMessage,
			user,
		};
	}

	async listMessages(groupId: string, lastEvaluatedKey?: any) {
		return this.query({
			limit: 20,
			indexName: 'group_id_index',
			key: {
				groupId,
			},
			...(lastEvaluatedKey && { lastEvaluatedKey }),
		});
	}
}
