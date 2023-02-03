import { createAsyncThunk } from '@reduxjs/toolkit';
import { SocketService } from 'src/services/socket.service';
import type { AppDispatch, RootState } from 'src/store/store';

// @ts-ignore
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: RootState;
	dispatch: AppDispatch;
	rejectValue: any;
	extra: { socketService: SocketService };
}>();
