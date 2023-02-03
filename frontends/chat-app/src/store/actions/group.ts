import { UserGroup } from 'src/types/group';
import { loadGroupChat } from 'src/store/actions/message';
import { createAppAsyncThunk } from 'src/store/thunk';

const LIST_USER_GROUPS = 'user-groups:list';

export const selectGroup = createAppAsyncThunk('groupsReducer/select', async (userGroup: UserGroup, { dispatch }) => {
	dispatch(loadGroupChat(userGroup.groupId));

	return userGroup;
});

export const loadGroups = createAppAsyncThunk(
	'groupsReducer/fetch',
	async (arg, { dispatch, extra: { socketService } }) => {
		const groups = await socketService.sendMessageAwaitResponse<UserGroup[]>({
			action: LIST_USER_GROUPS,
		});

		if (groups.length) {
			dispatch(selectGroup(groups[0]));
		}
		return groups;
	}
);
