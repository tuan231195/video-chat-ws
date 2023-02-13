export class MessageEntity {
	id!: string;

	userId!: string;

	groupId!: string;

	body!: string;

	type!: 'message' | 'video-call';

	createdAt!: Date;
}
