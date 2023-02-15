import { MediaConnection } from 'peerjs';
import { Logger } from 'src/services/logger';

declare let navigator: any;
const getUserMediaWrapper = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia).bind(
	navigator
);

export class MediaStreamService {
	private cache: Record<string, MediaConnection> = {};

	userStream: MediaStream | null = null;

	getUserMediaStream = async (constraints: MediaStreamConstraints) => {
		this.userStream = await new Promise((resolve, reject) => {
			getUserMediaWrapper(constraints, resolve, reject);
		});
		return this.userStream;
	};

	destroyUserStream() {
		Logger.info('Destroying user stream');
		this.userStream?.getTracks().forEach((track) => {
			track.stop();
		});
	}

	store(id: string, mediaConnection: MediaConnection) {
		this.cache[id] = mediaConnection;
	}

	get(id: string) {
		return this.cache[id] ?? null;
	}

	delete(id: string) {
		if (!id) {
			return;
		}
		const oldConnection = this.cache[id];
		delete this.cache[id];

		if (oldConnection) {
			Logger.info(`Destroying connection ${oldConnection.connectionId} for user ${id}`);
			oldConnection.remoteStream?.getTracks().forEach((track) => {
				track.stop();
			});
			oldConnection.close();
		}
	}
}
