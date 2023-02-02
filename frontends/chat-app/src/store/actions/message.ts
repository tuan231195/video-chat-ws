import { createAsyncThunk } from '@reduxjs/toolkit';
import { Logger } from 'src/services';

export const loadChat = createAsyncThunk('messages/fetch', async (groupId: string) => {
	Logger.info(groupId);
});
