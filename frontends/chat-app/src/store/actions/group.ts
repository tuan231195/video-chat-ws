import { createAsyncThunk } from '@reduxjs/toolkit';
import { socketService } from 'src/services';

export const loadGroups = createAsyncThunk('groups/fetch', async () =>
	socketService.sendMessageAwaitResponse({
		action: 'user-groups:list',
	})
);
