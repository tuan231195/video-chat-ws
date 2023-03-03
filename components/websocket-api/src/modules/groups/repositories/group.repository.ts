import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { GroupEntity } from 'src/modules/groups/domains/entities';
import { MessageRepository } from 'src/modules/messages/repositories';

@Injectable()
export class GroupRepository extends BaseRepository<GroupEntity> {
	private readonly groupTable: string;

	private readonly groupUsersTable: string;

	constructor(readonly dynamodbService: DynamoDbService, @Inject(CONFIG_TOKEN) private readonly config: Config) {
		const table = config.get('GROUPS_TABLE')!;
		super(dynamodbService, GroupEntity, table, [['id']]);
		this.groupTable = table;
		this.groupUsersTable = this.config.get('GROUP_USERS_TABLE')!;
	}

	async loadDetails(
		groupId: string,
		{
			messageRepository,
		}: {
			messageRepository: MessageRepository;
		}
	) {
		const group = await this.load({
			id: groupId,
		});
		if (!group) {
			return group;
		}

		return {
			...group,
			lastMessage: group.lastMessageId ? await messageRepository.loadDetails(group.lastMessageId) : null,
		};
	}
}
