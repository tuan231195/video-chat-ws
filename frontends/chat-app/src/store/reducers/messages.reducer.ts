/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadGroupChat } from 'src/store/actions/message';
import { Message } from 'src/types/message';

export interface State {
	groupId: string | null;
	loading: boolean;
	fetching: boolean;
	items: Message[];
	lastKey: any;
}

const initialState: State = {
	groupId: null,
	loading: true,
	fetching: false,
	items: [],
	lastKey: null,
};

export const messagesReducer = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		messageCreated: (state: State, action: PayloadAction<Message & { isCurrentUser: boolean }>) => {
			if (action.payload.groupId === state.groupId) {
				state.items.push(action.payload);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadGroupChat.fulfilled, (state, action) => {
				state.loading = false;
				if (!action.payload) {
					return;
				}
				const { messages: items, lastEvaluatedKey } = action.payload;
				state.items = items.reverse();
				state.lastKey = lastEvaluatedKey ?? null;
			})
			.addCase(loadGroupChat.pending, (state, action) => {
				state.groupId = action.meta.arg;
				state.items = [];
				state.loading = true;
			})
			.addCase(loadGroupChat.rejected, (state) => {
				state.loading = false;
			});
	},
});
