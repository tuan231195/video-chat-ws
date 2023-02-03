import { createAppAsyncThunk } from 'src/store/thunk';

const LIST_MESSAGES = 'messages:list';
const CREATE_MESSAGE = 'message:create';

export const loadGroupChat = createAppAsyncThunk(
	'messages/load',
	async (groupId: string, { extra: { socketService } }) =>
		socketService.sendMessageAwaitResponse<any>({
			action: LIST_MESSAGES,
			groupId,
		})
);

export const sendMessage = createAppAsyncThunk(
	'messages/send',
	async ({ groupId, message }: { groupId: string; message: string }, { extra: { socketService } }) =>
		socketService.sendMessageAwaitResponse<any>({
			action: CREATE_MESSAGE,
			groupId,
			message: {
				body: message,
			},
		})
);
