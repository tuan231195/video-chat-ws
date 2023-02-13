export class MessageDto {
	userId!: string;

	groupId!: string;

	body!: string;

	type!: 'message' | 'video-call';
}
