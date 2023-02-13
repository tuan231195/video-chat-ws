import { createAppAsyncThunk } from 'src/store/thunk';

const LIST_MESSAGES = 'messages:list';
const CREATE_MESSAGE = 'message:create';

export const loadGroupChat = createAppAsyncThunk(
	'messages/load',
	async (groupId: string, { extra: { socketService }, getState }) => {
		const messages = socketService.sendMessageAwaitResponse<any>({
			action: LIST_MESSAGES,
			groupId,
		});
		const {
			messages: { groupId: currentGroupId },
		} = getState();
		if (currentGroupId === groupId) {
			return messages;
		}
		return undefined;
	}
);

export const sendMessage = createAppAsyncThunk(
	'messages/send',
	async ({ groupId, message }: { groupId: string; message: string }, { extra: { socketService } }) =>
		socketService.sendMessageAwaitResponse<any>({
			action: CREATE_MESSAGE,
			groupId,
			message,
		})
);

export const loadMoreMessages = createAppAsyncThunk(
	'messages/loadMore',
	async ({ groupId }: { groupId: string }, { extra: { socketService }, getState }) => {
		const {
			messages: { lastKey },
		} = getState();
		if (!lastKey) {
			return undefined;
		}
		return socketService.sendMessageAwaitResponse<any>({
			action: LIST_MESSAGES,
			groupId,
			lastEvaluatedKey: lastKey,
		});
	}
);
