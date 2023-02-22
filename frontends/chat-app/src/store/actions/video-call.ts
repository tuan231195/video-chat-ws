import { createAppAsyncThunk } from 'src/store/thunk';
import type { VideoCallUser } from 'src/types/video-call';
import type { CallSubject } from 'src/services/peer.service';
import { Logger } from 'src/services/logger';

const JOIN_VIDEO_CALL = 'video-call:join';
const LEAVE_VIDEO_CALL = 'video-call:leave';
const GET_VIDEO_CALL_USERS = 'video-call:list-users';

export const loadVideoCall = createAppAsyncThunk(
	'video-call/load',
	async ({ groupId, videoCallId }: { groupId: string; videoCallId: string }, { extra: { socketService } }) =>
		socketService.sendMessageAwaitResponse<any>({
			action: GET_VIDEO_CALL_USERS,
			videoCallId,
			groupId,
		})
);

export const setupUserStream = createAppAsyncThunk(
	'video-call/user-stream',
	async (_, { extra: { mediaStreamService } }) => {
		await mediaStreamService.getUserMediaStream({
			video: true,
			audio: true,
		});
	}
);

export const callUsers = createAppAsyncThunk(
	'video-call/call-users',
	async (
		{ users, userStream }: { userStream: MediaStream; users: VideoCallUser[] },
		{ extra: { peerService, mediaStreamService, userService } }
	) => {
		const currentUser = userService.getUser()!;
		const otherUsers = users.filter(({ userId }) => userId !== currentUser.id);
		return Promise.all(
			otherUsers.map(async (user) => {
				Logger.info('Calling user', user);
				const call = await peerService.call(user.peerId, userStream, currentUser);
				mediaStreamService.store(user.userId, call);
				return user.user;
			})
		);
	}
);

export const joinVideoCall = createAppAsyncThunk(
	'video-call/join',
	async (groupId: string, { extra: { socketService, peerService, mediaStreamService }, dispatch }) => {
		await dispatch(setupUserStream());
		const userStream = mediaStreamService.userStream!;

		await peerService.init(userStream);

		const videoCallUser = await socketService.sendMessageAwaitResponse<any>({
			action: JOIN_VIDEO_CALL,
			groupId,
			peerId: peerService.getId(),
		});

		const { payload: videoCallUsers } = await dispatch(
			loadVideoCall({ groupId, videoCallId: videoCallUser.videoCallId })
		);

		await dispatch(callUsers({ users: videoCallUsers, userStream }));

		return videoCallUser;
	}
);

export const leaveVideoCall = createAppAsyncThunk(
	'video-call/leave',
	async (
		{ groupId, videoCallId }: { groupId: string; videoCallId: string },
		{ extra: { socketService, peerService, mediaStreamService }, getState }
	) => {
		const { videoCalls } = getState();
		videoCalls.otherUsers.forEach((user) => {
			mediaStreamService.delete(user.id);
		});
		peerService.disconnect();
		mediaStreamService.destroyUserStream();

		return socketService.sendMessageAwaitResponse<any>({
			action: LEAVE_VIDEO_CALL,
			groupId,
			videoCallId,
		});
	}
);

export const userJoined = createAppAsyncThunk(
	'video-call/user-joined',
	async ({ user, call }: CallSubject, { extra: { mediaStreamService }, getState }) => {
		if (!getState().videoCalls.videoCallId) {
			return null;
		}
		Logger.info('User joining', user);
		mediaStreamService.store(user.id, call);

		return user;
	}
);

export const userLeft = createAppAsyncThunk(
	'video-call/user-left',
	async (userId: string, { extra: { mediaStreamService }, getState }) => {
		if (!getState().videoCalls.videoCallId) {
			return null;
		}
		Logger.info('User leaving', userId);
		mediaStreamService.delete(userId);

		return userId;
	}
);
