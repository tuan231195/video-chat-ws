import { User } from 'src/types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { generateAvatar } from 'src/lib/common/avatar';

export const useUser = (): User => {
	const { user } = useAuth0();

	if (!user) {
		throw new Error('Unauthenticated');
	}
	return {
		id: user.sub!,
		name: user.name!,
		email: user.email,
		avatar: user.profile ?? generateAvatar(user.sub!),
	};
};
