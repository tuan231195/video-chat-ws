import { createAsyncThunk } from '@reduxjs/toolkit';
import { SocketService } from 'src/services/socket.service';
import type { AppDispatch, RootState } from 'src/store/store';
import { UserService } from 'src/services/user.service';
import { PeerService } from 'src/services/peer.service';
import { MediaStreamService } from 'src/services/media-stream.service';

type AppAsyncThunk = ReturnType<
	typeof createAsyncThunk.withTypes<{
		state: RootState;
		dispatch: AppDispatch;
		rejectValue: any;
		extra: {
			socketService: SocketService;
			userService: UserService;
			peerService: PeerService;
			mediaStreamService: MediaStreamService;
		};
	}>
>;
// @ts-ignore
export const createAppAsyncThunk: AppAsyncThunk = (typePrefix, payloadCreator, options) =>
	createAsyncThunk(typePrefix, payloadCreator, {
		...options,
		serializeError: (error: any) => ({
			status: error.status,
			name: error.name,
			message: error.message,
			errors: error.errors,
		}),
	}) as any;
