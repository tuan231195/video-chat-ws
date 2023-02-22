import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { socketService, userService } from 'src/services';
import { useUser } from 'src/context/session';
import { Main } from './Main';

function Auth() {
	const [loading, setLoading] = useState(true);
	const { getIdTokenClaims } = useAuth0();
	const user = useUser();
	useEffect(() => {
		(async () => {
			const token = await getIdTokenClaims();
			// eslint-disable-next-line no-underscore-dangle
			socketService.connect(token!.__raw);
			setLoading(true);
		})();
	}, []);

	useEffect(() => {
		userService.user = user;
	}, [user]);

	if (loading) {
		return <CenterSpin />;
	}

	return <Main />;
}

export default withAuthenticationRequired(Auth);
