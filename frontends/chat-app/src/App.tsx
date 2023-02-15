import React from 'react';
import 'antd/dist/reset.css';
import { mediaStreamService, store, userService } from 'src/services';
import { SessionContext } from 'src/context/session';
import { ConfigProvider } from 'antd';
import { Main } from 'src/Main';
import { Provider } from 'react-redux';
import { MediaContext } from 'src/context/media-context';

function App() {
	const session = userService.getSession();
	if (!session) {
		return <div>Unauthorized</div>;
	}

	return (
		<Provider store={store}>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#00b96b',
					},
				}}>
				<SessionContext.Provider value={session}>
					<MediaContext.Provider value={mediaStreamService}>
						<Main />
					</MediaContext.Provider>
				</SessionContext.Provider>
			</ConfigProvider>
		</Provider>
	);
}

export default App;
