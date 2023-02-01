import jwtDecode from 'jwt-decode';
import { Session } from 'src/context/session';

const USER_KEY = 'USER';
export class UserService {
	getSession(): Session | null {
		const token = localStorage.getItem(USER_KEY);
		if (!token) {
			return null;
		}
		try {
			const user: any = jwtDecode(token);
			return {
				token,
				user,
			};
		} catch (err) {
			return null;
		}
	}
}
