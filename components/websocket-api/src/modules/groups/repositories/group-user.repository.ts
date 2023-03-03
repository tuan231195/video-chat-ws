import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { GroupUserEntity } from 'src/modules/groups/domains/entities';
import { ErrorCodes } from 'src/utils/error-codes';

@Injectable()
export class GroupUserRepository extends BaseRepository<GroupUserEntity> {
	private readonly groupUsersTable: string;

	constructor(readonly dynamodbService: DynamoDbService, @Inject(CONFIG_TOKEN) private readonly config: Config) {
		const table = config.get('GROUP_USERS_TABLE')!;
		super(dynamodbService, GroupUserEntity, table, [['groupId', 'userId']]);
		this.groupUsersTable = this.config.get('GROUP_USERS_TABLE')!;
	}

	joinGroup(groupId: string, userId: string) {
		return this.save({
			groupId,
			userId,
			createdAt: new Date().toISOString(),
		});
	}

	getGroupUsers(groupId: string) {
		return this.dynamodbService.queryAll({
			tableName: this.groupUsersTable,
			key: {
				groupId,
			},
		}) as Promise<GroupUserEntity[]>;
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

	async checkGroupUser(groupId: string, userId: string) {
		const groupUser = await this.get({ groupId, userId });

		if (!groupUser) {
			throw new UnauthorizedException({
				message: 'User not in group',
				code: ErrorCodes.USER_NOT_IN_GROUP,
			});
		}
	}
}
