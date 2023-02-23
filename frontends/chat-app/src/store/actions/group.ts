import { UserGroup } from 'src/types/group';
import { loadGroupChat } from 'src/store/actions/message';
import { createAppAsyncThunk } from 'src/store/thunk';

const LIST_USER_GROUPS = 'user-groups:list';
const CREATE_GROUP = 'group:create';
const JOIN_GROUP = 'group:join';
const LEAVE_GROUP = 'group:leave';

export const selectGroup = createAppAsyncThunk('groups/select', async (userGroup: UserGroup, { dispatch }) => {
	dispatch(loadGroupChat(userGroup.groupId));

	return userGroup;
});

export const loadGroups = createAppAsyncThunk('groups/fetch', async (arg, { dispatch, extra: { socketService } }) => {
	const groups = await socketService.sendMessageAwaitResponse<UserGroup[]>({
		action: LIST_USER_GROUPS,
	});

	if (groups.length) {
		dispatch(selectGroup(groups[0]));
	}
	return groups;
});

export const createGroup = createAppAsyncThunk(
	'groups/create',
	async ({ name }: { name: string }, { extra: { socketService }, dispatch }) => {
		const result = await socketService.sendMessageAwaitResponse<UserGroup>({
			action: CREATE_GROUP,
			name,
		});
		dispatch(selectGroup(result));
		return result;
	}
);

export const joinGroup = createAppAsyncThunk(
	'groups/join',
	async ({ groupId }: { groupId: string }, { extra: { socketService }, dispatch }) => {
		const result = await socketService.sendMessageAwaitResponse<UserGroup>({
			action: JOIN_GROUP,
			groupId,
		});
		dispatch(selectGroup(result));
		return result;
	}
);

export const leaveGroup = createAppAsyncThunk(
	'groups/leave',
	async (groupId: string, { extra: { socketService }, dispatch, getState }) => {
		await socketService.sendMessageAwaitResponse<UserGroup>({
			action: LEAVE_GROUP,
			groupId,
		});
		const {
			groups: { items },
		} = getState();

		const otherGroups = items.filter((item) => item.groupId !== groupId);
		if (otherGroups.length) {
			dispatch(selectGroup(otherGroups[0]));
		}
		return groupId;
	}
);
