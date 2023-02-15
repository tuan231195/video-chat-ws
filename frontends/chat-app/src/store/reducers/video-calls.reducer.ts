/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'src/types/user';
import { callUsers, joinVideoCall, userJoined, userLeft } from 'src/store/actions/video-call';

export interface State {
	loading: boolean;
	videoCallId: string | null;
	otherUsers: User[];
}

const initialState: State = {
	loading: false,
	videoCallId: null,
	otherUsers: [],
};

export const videoCallsReducer = createSlice({
	name: 'video-calls',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(callUsers.fulfilled, (state, action) => {
				state.otherUsers = action.payload;
			})
			.addCase(userJoined.fulfilled, (state: State, action) => {
				const { payload } = action;
				if (!payload) {
					return;
				}
				const matchingUserIndex = state.otherUsers.findIndex((item) => item.id === payload.id);
				if (matchingUserIndex >= 0) {
					state.otherUsers[matchingUserIndex] = { ...payload };
				} else {
					state.otherUsers = state.otherUsers.concat({ ...payload });
				}
			})
			.addCase(userLeft.fulfilled, (state: State, action: PayloadAction<string | null>) => {
				const { payload } = action;
				if (!payload) {
					return;
				}
				state.otherUsers = state.otherUsers.filter((otherUser) => otherUser.id !== payload);
			})
			.addCase(joinVideoCall.pending, (state) => {
				state.loading = true;
			})
			.addCase(joinVideoCall.fulfilled, (state, action) => {
				state.videoCallId = action.payload.videoCallId;
				state.loading = false;
			})
			.addCase(joinVideoCall.rejected, (state) => {
				state.loading = false;
			});
	},
});
