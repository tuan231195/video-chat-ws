import { UserService } from 'src/services/user.service';
import { SocketListenerService } from 'src/services/socket-listener.service';
import { createStore } from 'src/store/store';
import { PeerService } from 'src/services/peer.service';
import { MediaStreamService } from 'src/services/media-stream.service';
import { SocketService } from './socket.service';

export * from './logger';

export const userService = new UserService();
export const socketService = new SocketService(userService);
export const mediaStreamService = new MediaStreamService();
export const peerService = new PeerService();

export const store = createStore(socketService, userService, peerService, mediaStreamService);
export const socketListenerService = new SocketListenerService(store, socketService, peerService, userService);
