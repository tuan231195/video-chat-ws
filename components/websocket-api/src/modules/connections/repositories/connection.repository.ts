import { Inject, Injectable } from '@nestjs/common';
import { DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { UserRepository } from 'src/modules/users/repositories';

@Injectable()
export class ConnectionRepository {
	private readonly connectionTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
		private readonly userRepository: UserRepository,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		this.connectionTable = this.config.get('CONNECTIONS_TABLE')!;
	}

	createConnection(connectionId: string, userId: string) {
		this.logger.info(`New connection ${connectionId} for user ${userId}`);
		return this.dynamodbService.putItem(this.connectionTable, {
			id: connectionId,
			userId,
		});
	}

	async destroyConnection(connectionId: string, userId: string) {
		this.logger.info(`Deleting connection ${connectionId}`);
		await this.dynamodbService.destroyItem(this.connectionTable, {
			id: connectionId,
		});
		await this.userRepository.removeConnection(userId, connectionId);
	}
}
