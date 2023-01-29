import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { Group } from 'src/modules/groups/domains';
import { newId } from 'src/utils/id';

@Injectable()
export class GroupRepository extends BaseRepository {
	private readonly groupTable: string;

	private readonly groupUsersTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		super(dynamodbService, config.get('GROUPS_TABLE')!, [['id']]);
		this.groupTable = this.config.get('GROUPS_TABLE')!;
		this.groupUsersTable = this.config.get('GROUP_USERS_TABLE')!;
	}

	createGroup(group: Group) {
		this.logger.info(`New group`, {
			group,
		});
		return this.dynamodbService.putItem(this.groupTable, {
			...group,
			createdAt: new Date(),
			id: newId(),
		});
	}

	getGroupUsers(groupId: string) {
		return this.dynamodbService.queryAll({
			tableName: this.groupUsersTable,
			key: {
				groupId,
			},
		});
	}

	joinGroup(groupId: string, userId: string, connectionId: string) {
		this.logger.info(`User ${userId} with connection ${connectionId} joined group ${groupId}`);

		return this.dynamodbService.putItem(this.groupUsersTable, {
			groupId,
			userId,
			connectionId,
		});
	}

	leaveGroup(groupId: string, userId: string) {
		this.logger.info(`User ${userId} left group ${groupId}`);

		return this.dynamodbService.destroyItem(this.groupUsersTable, {
			groupId,
			userId,
		});
	}

	destroyGroup(groupId: string) {
		this.logger.info(`Destroy group ${groupId}`);

		return this.dynamodbService.destroyItem(this.groupTable, {
			id: groupId,
		});
	}

	getUserGroups(userId: string) {
		return this.dynamodbService.queryAll({
			tableName: this.groupUsersTable,
			key: {
				userId,
			},
			indexName: 'user_id_index',
		});
	}
}
