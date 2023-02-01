import React from 'react';
import { userService } from 'src/services';
import { SessionContext } from 'src/context/session';

function App() {
	const user = userService.getSession();
	if (!user) {
		return <div>Unauthorized</div>;
	}

	return <SessionContext.Provider value={user}>Authorized</SessionContext.Provider>;
}

export default App;
