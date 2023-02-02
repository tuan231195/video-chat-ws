/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { UserGroup } from 'src/types/group';
import { loadChat } from 'src/store/actions/message';

export interface InitialState {
	loading: boolean;
	items: UserGroup[];
	lastKey: any;
}

const initialState: InitialState = {
	loading: false,
	items: [],
	lastKey: null,
};

export const messagesReducer = createSlice({
	name: 'messages',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadChat.fulfilled, (state, action) => {
				const { messages: items, lastEvaluatedKey } = action.payload;
				state.items = items;
				state.lastKey = lastEvaluatedKey ?? null;
			})
			.addCase(loadChat.pending, (state) => {
				state.items = [];
				state.loading = true;
			})
			.addCase(loadChat.rejected, (state) => {
				state.loading = false;
			});
	},
});
