import { User } from 'src/types/user';
import { useAuth0 } from '@auth0/auth0-react';

export const useUser = (): User => {
	const { user } = useAuth0();

	if (!user) {
		throw new Error('Unauthenticated');
	}
	return {
		id: user.sub!,
		name: user.name!,
		email: user.email,
	};
};
