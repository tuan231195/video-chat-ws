import { createAsyncThunk } from '@reduxjs/toolkit';
import { SocketService } from 'src/services/socket.service';
import type { AppDispatch, RootState } from 'src/store/store';
import { UserService } from 'src/services/user.service';
import { PeerService } from 'src/services/peer.service';
import { MediaStreamService } from 'src/services/media-stream.service';

// @ts-ignore
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: RootState;
	dispatch: AppDispatch;
	rejectValue: any;
	extra: {
		socketService: SocketService;
		userService: UserService;
		peerService: PeerService;
		mediaStreamService: MediaStreamService;
	};
}>();
