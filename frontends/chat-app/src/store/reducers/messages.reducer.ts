/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadGroupChat } from 'src/store/actions/message';
import { Message } from 'src/types/message';

export interface State {
	loading: boolean;
	fetching: boolean;
	items: Message[];
	lastKey: any;
}

const initialState: State = {
	loading: true,
	fetching: false,
	items: [],
	lastKey: null,
};

export const messagesReducer = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		messageCreated: (state: State, action: PayloadAction<Message>) => {
			state.items.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadGroupChat.fulfilled, (state, action) => {
				const { messages: items, lastEvaluatedKey } = action.payload;
				state.items = items.reverse();
				state.lastKey = lastEvaluatedKey ?? null;
				state.loading = false;
			})
			.addCase(loadGroupChat.pending, (state) => {
				state.items = [];
				state.loading = true;
			})
			.addCase(loadGroupChat.rejected, (state) => {
				state.loading = false;
			});
	},
});
