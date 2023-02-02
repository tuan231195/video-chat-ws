import { createAsyncThunk } from '@reduxjs/toolkit';
import { socketService } from 'src/services';
import { UserGroup } from 'src/types/group';
import { loadChat } from 'src/store/actions/message';

export const selectGroup = createAsyncThunk('groups/select', async (userGroup: UserGroup, { dispatch }) => {
	dispatch(loadChat(userGroup.groupId));

	return userGroup;
});

export const loadGroups = createAsyncThunk('groups/fetch', async (arg, { dispatch }) => {
	const groups = await socketService.sendMessageAwaitResponse({
		action: 'user-groups:list',
	});

	if (groups.length) {
		dispatch(selectGroup(groups[0]));
	}
	return groups;
});
