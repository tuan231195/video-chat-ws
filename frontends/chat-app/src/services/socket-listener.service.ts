import { SocketService } from 'src/services/socket.service';
import { messagesReducer } from 'src/store/reducers/messages.reducer';
import { Store } from '@reduxjs/toolkit';

export class SocketListenerService {
	constructor(private readonly store: Store, private readonly socketService: SocketService) {
		this.initListeners();
	}

	private initListeners() {
		this.socketService.subscribe((response: any) => {
			if (response.action === 'message:created') {
				this.store.dispatch(messagesReducer.actions.messageCreated(response.result.message));
			}
		});
	}
}
