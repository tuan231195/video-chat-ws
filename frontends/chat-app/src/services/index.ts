import { UserService } from 'src/services/user.service';
import { SocketListenerService } from 'src/services/socket-listener.service';
import { createStore } from 'src/store/store';
import { SocketService } from './socket.service';

export * from './logger';

export const userService = new UserService();
export const socketService = new SocketService(userService);

export const store = createStore(socketService);
export const socketListenerService = new SocketListenerService(store, socketService);
