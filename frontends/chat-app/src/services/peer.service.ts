import { MediaConnection, Peer } from 'peerjs';
import { Subject } from 'rxjs';
import { User } from 'src/types/user';
import { Logger } from 'src/services/logger';

export interface CallSubject {
	call: MediaConnection;
	user: User;
}

export class PeerService {
	private peerInstance: Peer | null = null;

	private userStream: MediaStream | null = null;

	private subject: Subject<CallSubject> = new Subject();

	get peer() {
		if (!this.peerInstance) {
			throw new Error('Peer not init');
		}
		return this.peerInstance;
	}

	async init(userStream: MediaStream) {
		const peerInstance = new Peer({});
		this.peerInstance = peerInstance;
		this.userStream = userStream;
		return new Promise((resolve, reject) => {
			peerInstance.on('open', () => {
				resolve(peerInstance);
				peerInstance.on('call', (call) => {
					call.answer(userStream);
					call.on('stream', () => {
						this.subject.next({
							call,
							user: call.metadata.user,
						});
					});
					call.on('error', Logger.error);
				});
			});
			peerInstance.on('error', reject);
			peerInstance.on('close', reject);
		});
	}

	subscribe(subscriber: (value: CallSubject) => void) {
		this.subject.subscribe(subscriber);
	}

	getId() {
		return this.peer.id;
	}

	call(peerId: string, stream: MediaStream, user: User): Promise<MediaConnection> {
		return new Promise((resolve, reject) => {
			const call = this.peer.call(peerId, stream, {
				metadata: {
					user,
				},
			});
			call.on('stream', () => resolve(call));
			call.on('error', reject);
		});
	}

	disconnect() {
		if (this.peerInstance) {
			this.peerInstance.disconnect();
			this.peerInstance = null;
			this.userStream = null;
		}
	}
}
