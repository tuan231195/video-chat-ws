import { User } from 'src/types/user';

export interface Message {
	body: string;
	groupId: string;

	id: string;

	user: User;

	userId: string;

	createdAt: string;
}
