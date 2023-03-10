import { Action, combineReducers, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { groupsReducer } from 'src/store/reducers/groups.reducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { errorMiddleware } from 'src/store/middlewares/error';
import { messagesReducer } from 'src/store/reducers/messages.reducer';
import { SocketService } from 'src/services/socket.service';
import { UserService } from 'src/services/user.service';
import { videoCallsReducer } from 'src/store/reducers/video-calls.reducer';
import { PeerService } from 'src/services/peer.service';
import { MediaStreamService } from 'src/services/media-stream.service';

const reducers = combineReducers({
	groups: groupsReducer.reducer,
	messages: messagesReducer.reducer,
	videoCalls: videoCallsReducer.reducer,
});

export function createStore(
	socketService: SocketService,
	userService: UserService,
	peerService: PeerService,
	mediaStreamService: MediaStreamService
) {
	return configureStore({
		devTools: true,
		reducer: reducers,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: {
						socketService,
						userService,
						peerService,
						mediaStreamService,
					},
				},
			}).concat(errorMiddleware.middleware),
	});
}

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = ThunkDispatch<RootState, any, Action>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
