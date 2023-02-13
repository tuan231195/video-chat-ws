import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { User, UserEntity } from 'src/modules/users/domains';
import { uniq } from 'lodash';

@Injectable()
export class UserRepository extends BaseRepository {
	private readonly userTable: string;

	constructor(
		readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		const table = config.get('USERS_TABLE')!;
		super(dynamodbService, UserEntity, table, [['id']]);
		this.userTable = table!;
	}

	async syncUser(user: User, connectionId: string) {
		this.logger.info(`Upsert new user`, {
			user,
		});
		const existingUser = await this.dynamodbService.get(this.userTable, {
			id: user.id,
		});
		return this.dynamodbService.putItem(this.userTable, {
			...existingUser,
			...user,
			lastActive: new Date().toISOString(),
			connections: uniq((existingUser?.connections ?? []).concat(connectionId)),
			...(!existingUser
				? {
						createdAt: new Date().toISOString(),
				  }
				: null),
		});
	}

	async removeConnection(userId: any, connectionId: string) {
		const existingUser = await this.dynamodbService.get(this.userTable, {
			id: userId,
		});
		if (!existingUser) {
			return;
		}
		this.logger.info(`Removing user ${userId} connection ${connectionId}`);
		await this.dynamodbService.putItem(this.userTable, {
			...existingUser,
			connections: existingUser.connections?.filter((id: string) => connectionId !== id) ?? [],
		});
	}
}
