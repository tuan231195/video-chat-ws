import React, { useEffect } from 'react';
import { Logger } from 'src/lib/logger';
import { SocketService } from './lib';

function App() {
	useEffect(() => {
		const websocket = new SocketService();
		websocket.connect();
		websocket
			.sendMessageAwaitResponse({ action: 'user-groups:list', userId: 'abc123' })
			.then(Logger.info)
			.catch(Logger.error);
		websocket.sendMessageAwaitResponse({ action: 'user-groups:list' }).then(Logger.info).catch(Logger.error);
	}, []);
	return <div className="App">Learn React</div>;
}

export default App;
