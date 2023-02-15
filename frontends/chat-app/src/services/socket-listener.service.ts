import { SocketService } from 'src/services/socket.service';
import { messagesReducer } from 'src/store/reducers/messages.reducer';
import { Store } from '@reduxjs/toolkit';
import { UserService } from 'src/services/user.service';
import { PeerService } from 'src/services/peer.service';
import { userJoined, userLeft } from 'src/store/actions/video-call';
import type { AppDispatch } from 'src/store/store';

export class SocketListenerService {
	constructor(
		private readonly store: Store,
		private readonly socketService: SocketService,
		private readonly peerService: PeerService,
		private readonly userService: UserService
	) {
		this.initListeners();
	}

	private initListeners() {
		const dispatch: AppDispatch = this.store.dispatch.bind(this.store);
		this.socketService.subscribe((response: any) => {
			if (response.action === 'message:created') {
				dispatch(
					messagesReducer.actions.messageCreated({
						...response.result.message,
						isCurrentUser: this.userService.getSession()?.user.id === response.result.message.userId,
					})
				);
			}
			if (response.action === 'video-call:user-left') {
				const {
					result: {
						videoCallUser: { userId },
					},
				} = response;
				dispatch(userLeft(userId));
			}
		});

		this.peerService.subscribe(({ call, user }) => {
			dispatch(userJoined({ call, user }));
		});
	}
}
