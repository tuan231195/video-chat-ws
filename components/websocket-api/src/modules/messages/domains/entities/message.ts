import { UserEntity } from 'src/modules/users/domains';

export class MessageEntity {
	id!: string;

	userId!: string;

	user?: UserEntity;

	groupId!: string;

	body!: string;

	type!: 'message' | 'video-call';

	createdAt!: Date;
}
