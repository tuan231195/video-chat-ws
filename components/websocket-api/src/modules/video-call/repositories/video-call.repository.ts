import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { newId } from 'src/utils/id';
import { VideoCallEntity, VideoCallUserEntity } from 'src/modules/video-call/domains';

const ATTRIBUTE_EXISTS = 'attribute_exists(id)';

@Injectable()
export class VideoCallRepository extends BaseRepository {
	private readonly videoCallTable: string;

	private readonly videoCallUsersTable: string;

	constructor(
		readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger
	) {
		const table = config.get('VIDEO_CALL_TABLE')!;
		super(dynamodbService, VideoCallEntity, table, [['id']]);
		this.videoCallTable = table!;
		this.videoCallUsersTable = config.get('VIDEO_CALL_USERS_TABLE')!;
	}

	async listVideoCallUsers(videoCallId: string) {
		return this.dynamodbService.queryAll({
			tableName: this.videoCallUsersTable,
			key: {
				videoCallId,
			},
		}) as Promise<VideoCallUserEntity[]>;
	}

	async joinVideoCall(videoCallId: string, userId: string) {
		await this.dynamodbService.documentClient.update({
			Key: {
				id: videoCallId,
			},
			TableName: this.videoCallTable,
			UpdateExpression: 'ADD participantCount 1',
			ConditionExpression: ATTRIBUTE_EXISTS,
		});
		await this.dynamodbService.putItem(this.videoCallUsersTable, {
			videoCallId,
			userId,
			joinedAt: new Date().toISOString(),
			leftDate: null,
		});
	}

	async leftVideoCall(videoCallId: string, userId: string) {
		const { Attributes: { ParticipantCount = 0 } = {} } = await this.dynamodbService.documentClient.update({
			Key: {
				id: videoCallId,
			},
			TableName: this.videoCallTable,
			UpdateExpression: 'ADD participantCount -1',
			ReturnValues: 'UPDATED_NEW',
			ConditionExpression: ATTRIBUTE_EXISTS,
		});
		await this.dynamodbService.upsert(
			this.videoCallUsersTable,
			{
				videoCallId,
				userId,
			},
			{
				videoCallId,
				userId,
				leftAt: new Date().toISOString(),
			}
		);
		if (!ParticipantCount) {
			await this.deactivateVideoCall(videoCallId);
		}
	}

	async findOrCreateNewVideoCall(groupId: string, userId: string): Promise<VideoCallEntity> {
		const activeVideoCall = await this.get({
			groupId,
			status: 'active',
		});
		if (activeVideoCall) {
			return activeVideoCall;
		}

		return this.save({
			id: newId(),
			creator: userId,
			groupId,
			status: 'active',
			createdAt: new Date().toISOString(),
		});
	}

	async deactivateVideoCall(videoCallId: string) {
		await this.dynamodbService.documentClient.update({
			Key: {
				id: videoCallId,
			},
			TableName: this.videoCallTable,
			UpdateExpression: 'SET status = :status AND endAt = :endAt',
			ExpressionAttributeValues: {
				status: 'inactive',
				endAt: new Date().toISOString(),
			},
			ReturnValues: 'UPDATED_NEW',
			ConditionExpression: ATTRIBUTE_EXISTS,
		});
	}
}
