import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { Group } from 'src/modules/groups/domains';
import { newId } from 'src/utils/id';
import { GroupEntity, GroupUserEntity } from 'src/modules/groups/domains/entities';

@Injectable()
export class GroupRepository extends BaseRepository {
	private readonly groupTable: string;

	private readonly groupUsersTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		const table = config.get('GROUPS_TABLE')!;
		super(dynamodbService, table, [['id']]);
		this.groupTable = table;
		this.groupUsersTable = this.config.get('GROUP_USERS_TABLE')!;
	}

	createGroup(group: Group): Promise<GroupEntity> {
		this.logger.info(`New group`, {
			group,
		});
		return this.dynamodbService.putItem(this.groupTable, {
			...group,
			createdAt: new Date().toISOString(),
			id: newId(),
		}) as Promise<GroupEntity>;
	}

	getGroupUsers(groupId: string) {
		return this.dynamodbService.queryAll({
			tableName: this.groupUsersTable,
			key: {
				groupId,
			},
		}) as Promise<GroupUserEntity[]>;
	}

	async getGroupUser(groupId: string, userId: string) {
		const { Item: groupUser = null } = await this.dynamodbService.documentClient.get({
			TableName: this.groupUsersTable,
			Key: {
				groupId,
				userId,
			},
		});
		return groupUser as GroupUserEntity | null;
	}

	joinGroup(groupId: string, userId: string) {
		this.logger.info(`User ${userId} joined group ${groupId}`);

		return this.dynamodbService.putItem(this.groupUsersTable, {
			groupId,
			userId,
			createdAt: new Date().toISOString(),
		}) as Promise<GroupUserEntity>;
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
		}) as Promise<GroupUserEntity[]>;
	}

	async updateGroup(groupId: string, props: Record<string, any>) {
		return this.dynamodbService.upsert(
			this.groupTable,
			{ id: groupId },
			{
				...props,
				id: groupId,
			}
		);
	}
}
