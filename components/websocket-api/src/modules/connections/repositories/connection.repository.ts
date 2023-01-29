import { Inject, Injectable } from '@nestjs/common';
import { DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';

@Injectable()
export class ConnectionRepository {
	private readonly connectionTable: string;

	constructor(
		private readonly dynamodbService: DynamoDbService,
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

	destroyConnection(connectionId: string) {
		this.logger.info(`Deleting connection ${connectionId}`);
		return this.dynamodbService.destroyItem(this.connectionTable, {
			id: connectionId,
		});
	}
}
