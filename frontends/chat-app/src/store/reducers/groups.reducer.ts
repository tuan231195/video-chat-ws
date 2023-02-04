/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { UserGroup } from 'src/types/group';
import { loadGroupChat } from 'src/store/actions/message';
import { messagesReducer } from 'src/store/reducers/messages.reducer';
import { loadGroups, selectGroup } from '../actions/group';

export interface State {
	selectedGroupId: string | null;
	loading: boolean;
	items: UserGroup[];
}

const initialState: State = {
	selectedGroupId: null,
	loading: false,
	items: [],
};

export const groupsReducer = createSlice({
	name: 'groups',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadGroupChat.fulfilled, (state) => {
				if (state.selectedGroupId) {
					const currentGroupUser = state.items.find(
						(groupUser) => groupUser.groupId === state.selectedGroupId
					);

					if (currentGroupUser) {
						currentGroupUser.lastAccess = new Date().toISOString();
					}
				}
			})
			.addCase(messagesReducer.actions.messageCreated, (state, action) => {
				const messageGroupUser = state.items.find((groupUser) => groupUser.groupId === action.payload.groupId);
				if (messageGroupUser) {
					messageGroupUser.group.lastMessage = action.payload;
					if (action.payload.isCurrentUser) {
						messageGroupUser.lastAccess = action.payload.createdAt;
					}
				}
			})
			.addCase(selectGroup.fulfilled, (state, action) => {
				state.selectedGroupId = action.payload.groupId;
			})
			.addCase(loadGroups.pending, (state) => {
				state.items = [];
				state.loading = true;
			})
			.addCase(loadGroups.fulfilled, (state, action) => {
				state.items = action.payload;
				state.loading = false;
			})
			.addCase(loadGroups.rejected, (state) => {
				state.loading = false;
			});
	},
});
