import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { newId } from 'src/utils/id';
import { VideoCallEntity } from 'src/modules/video-call/domains';

const ATTRIBUTE_EXISTS = 'attribute_exists(id)';

@Injectable()
export class VideoCallRepository extends BaseRepository {
	private readonly videoCallTable: string;

	constructor(
		readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		const table = config.get('VIDEO_CALL_TABLE')!;
		super(dynamodbService, VideoCallEntity, table, [['id']]);
		this.videoCallTable = table!;
	}

	async findOrCreateNewVideoCall(groupId: string, userId: string): Promise<VideoCallEntity> {
		const {
			items: [activeVideoCall],
		} = await this.query({
			key: { groupId, status: 'active' },
			indexName: 'group_id_index',
		});
		if (activeVideoCall) {
			this.logger.info(`Using existing video call ${activeVideoCall.id} for group ${groupId}`);
			return activeVideoCall;
		}

		const id = newId();
		this.logger.info(`Creating new video call ${id} by user ${userId} for group ${groupId}`);
		return this.save({
			id,
			creator: userId,
			groupId,
			status: 'active',
			createdAt: new Date().toISOString(),
		});
	}

	async deactivateVideoCall(videoCallId: string) {
		this.logger.info('Deactivating video call');
		await this.dynamodbService.documentClient.update({
			Key: {
				id: videoCallId,
			},
			TableName: this.videoCallTable,
			UpdateExpression: 'SET #status = :status, #endAt = :endAt',
			ExpressionAttributeNames: {
				'#status': 'status',
				'#endAt': 'endAt',
			},
			ExpressionAttributeValues: {
				':status': 'inactive',
				':endAt': new Date().toISOString(),
			},
			ReturnValues: 'UPDATED_NEW',
			ConditionExpression: ATTRIBUTE_EXISTS,
		});
	}
}
