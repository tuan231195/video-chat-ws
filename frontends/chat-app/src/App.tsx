import React from 'react';
import 'antd/dist/reset.css';
import { mediaStreamService, store } from 'src/services';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { MediaContext } from 'src/context/media-context';
import { Auth0Provider } from '@auth0/auth0-react';
import Auth from 'src/Auth';

function App() {
	return (
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN!}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}>
			<Provider store={store}>
				<ConfigProvider
					theme={{
						token: {
							colorPrimary: '#00b96b',
						},
					}}>
					<MediaContext.Provider value={mediaStreamService}>
						<Auth />
					</MediaContext.Provider>
				</ConfigProvider>
			</Provider>
		</Auth0Provider>
	);
}

export default App;
