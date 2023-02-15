import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository, DynamoDbService } from '@vdtn359/dynamodb-nestjs-module';
import { CONFIG_TOKEN, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';
import { VideoCallUserEntity } from 'src/modules/video-call/domains';
import { VideoCallRepository } from 'src/modules/video-call/repositories/video-call.repository';
import { UserRepository } from 'src/modules/users/repositories';

@Injectable()
export class VideoCallUserRepository extends BaseRepository<VideoCallUserEntity> {
	private readonly videoCallUsersTable: string;

	constructor(
		readonly dynamodbService: DynamoDbService,
		@Inject(CONFIG_TOKEN) private readonly config: Config,
		private readonly logger: RequestLogger,
		private readonly videoCallRepository: VideoCallRepository,
		private readonly userRepository: UserRepository
	) {
		const table = config.get('VIDEO_CALL_USERS_TABLE')!;
		super(dynamodbService, VideoCallUserEntity, table, [['id']]);
		this.videoCallUsersTable = config.get('VIDEO_CALL_USERS_TABLE')!;
	}

	async joinVideoCall({
		videoCallId,
		userId,
		peerId,
		connectionId,
	}: {
		videoCallId: string;
		userId: string;
		peerId: string;
		connectionId: string;
	}) {
		return this.save({
			videoCallId,
			peerId,
			userId,
			connectionId,
			joinedAt: new Date().toISOString(),
			leftAt: null,
		});
	}

	async getActiveUserCount(videoCallId: string) {
		const allUsers = await this.queryAll({
			key: {
				videoCallId,
			},
		});
		return allUsers.filter((user) => !user.leftAt).length;
	}

	async leftVideoCall(videoCallId: string, userId: string) {
		const participantCount = await this.getActiveUserCount(videoCallId);
		const videoCallUser = await this.upsert(
			{
				videoCallId,
				userId,
			},
			{
				leftAt: new Date().toISOString(),
			}
		);
		if (!participantCount) {
			await this.videoCallRepository.deactivateVideoCall(videoCallId);
		}

		return videoCallUser;
	}

	loadDetails(idOrUser: string): Promise<VideoCallUserEntity | null>;
	loadDetails(idOrUser: VideoCallUserEntity): Promise<VideoCallUserEntity>;
	async loadDetails(idOrUser: string | VideoCallUserEntity): Promise<VideoCallUserEntity | null> {
		if (!idOrUser) {
			return null;
		}
		let loadedEntity: VideoCallUserEntity | null;
		if (typeof idOrUser === 'string') {
			loadedEntity = await this.load({ id: idOrUser });
		} else {
			loadedEntity = idOrUser;
		}
		if (!loadedEntity) {
			return null;
		}
		const user = await this.userRepository.load({ id: loadedEntity.userId });
		delete user.connections;
		return {
			...loadedEntity,
			user,
		};
	}
}
