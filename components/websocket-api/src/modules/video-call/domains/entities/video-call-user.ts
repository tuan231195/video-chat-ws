import { UserEntity } from 'src/modules/users/domains';

export class VideoCallUserEntity {
	id!: string;

	videoCallId!: string;

	userId!: string;

	peerId!: string;

	connectionId!: string;

	user?: UserEntity;

	joinedAt!: string;

	leftAt!: string;
}
