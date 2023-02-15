import { User } from 'src/types/user';

export interface VideoCallUser {
	videoCallId: string;
	userId: string;
	peerId: string;
	user: User;
}
