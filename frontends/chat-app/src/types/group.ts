import { Message } from 'src/types/message';

export interface UserGroup {
	userId: string;
	connectionId: string;
	groupId: string;
	group: Group;
	lastAccess: string;
}
export interface Group {
	id: string;
	name: string;
	lastMessage: Message | null;
}
