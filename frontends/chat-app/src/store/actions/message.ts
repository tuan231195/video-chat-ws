import { createAsyncThunk } from '@reduxjs/toolkit';
import { socketService } from 'src/services';

export const loadChat = createAsyncThunk('messages/fetch', async (groupId: string) =>
	socketService.sendMessageAwaitResponse<any>({
		action: 'messages:list',
		groupId,
	})
);
