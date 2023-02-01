/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { loadGroups } from '../actions/group';

const initialState = {
	items: [],
};

export const groups = createSlice({
	name: 'groups',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loadGroups.fulfilled, (state, action) => {
			state.items = action.payload;
		});
	},
});
