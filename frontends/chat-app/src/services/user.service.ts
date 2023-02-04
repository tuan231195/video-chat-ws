import jwtDecode from 'jwt-decode';
import { Session } from 'src/context/session';

const USER_KEY = 'USER';
export class UserService {
	session: Session | null = null;

	getSession(): Session | null {
		if (this.session) {
			return this.session;
		}
		const token = localStorage.getItem(USER_KEY);
		if (!token) {
			return null;
		}
		try {
			const user: any = jwtDecode(token);
			this.session = {
				token,
				user: {
					...user,
					id: user.sub,
				},
			};
			return this.session;
		} catch (err) {
			return null;
		}
	}
}
