import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { User } from 'src/modules/users/domains';

@Injectable()
export class UserRepository extends BaseRepository {
	private readonly userTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		const table = config.get('USERS_TABLE')!;
		super(dynamodbService, table, [['id']]);
		this.userTable = table!;
	}

	async upsertUser(user: User) {
		this.logger.info(`Created new user`, {
			user,
		});
		const { Item: existingUser } = await this.dynamodbService.documentClient.get({
			Key: {
				id: user.id,
			},
			TableName: this.userTable,
		});
		return this.dynamodbService.putItem(this.userTable, {
			...existingUser,
			...user,
			lastActive: new Date().toISOString(),
			...(!existingUser
				? {
						createdAt: new Date().toISOString(),
				  }
				: null),
		});
	}
}
