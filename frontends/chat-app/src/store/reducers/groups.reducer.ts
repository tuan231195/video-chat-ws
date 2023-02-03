/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { UserGroup } from 'src/types/group';
import { loadGroups, selectGroup } from '../actions/group';

export interface State {
	selectedGroup: UserGroup | null;
	loading: boolean;
	items: UserGroup[];
}

const initialState: State = {
	selectedGroup: null,
	loading: false,
	items: [],
};

export const groupsReducer = createSlice({
	name: 'groups',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(selectGroup.fulfilled, (state, action) => {
				state.selectedGroup = action.payload;
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
