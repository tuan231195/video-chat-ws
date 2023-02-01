import { UserService } from 'src/services/user.service';
import { SocketService } from './socket.service';

export * from './logger';

export const userService = new UserService();
export const socketService = new SocketService(userService);
