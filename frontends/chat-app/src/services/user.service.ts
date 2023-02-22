import type { User } from 'src/types/user';

export class UserService {
	user: User | null = null;

	getUser(): User | null {
		return this.user;
	}
}
