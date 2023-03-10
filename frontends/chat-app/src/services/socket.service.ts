import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { v4 as uuidv4 } from 'uuid';
import { catchError, concatMap, EMPTY, filter, lastValueFrom, of, Subject, take, tap, timeout } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { ResponseError } from 'src/lib/errors';
import { Logger } from 'src/services/logger';

type Message = Record<string, any> & {
	action: string;
};

export class SocketService {
	constructor(private readonly userService: UserService) {}

	private socket$!: WebSocketSubject<any>;

	private messagesSubject$ = new Subject();

	public connect(token: string) {
		if (!this.socket$ || this.socket$.closed) {
			this.socket$ = this.getNewWebSocket(token);
			this.socket$
				.pipe(
					tap({
						error: Logger.error,
					}),
					catchError((err) => {
						Logger.error('Socket error', err);
						return EMPTY;
					})
				)
				.subscribe(this.messagesSubject$);
		}
	}

	private getNewWebSocket(token: string) {
		return webSocket(`${import.meta.env.VITE_WEBSOCKET_API_URL}?authorization=${token}`);
	}

	sendMessage(msg: Message) {
		this.socket$.next(msg);
	}

	sendMessageAwaitResponse<T = any>(message: Message): Promise<T> {
		const correlationId = uuidv4();
		this.socket$.next({
			...message,
			correlationId,
		});

		return lastValueFrom(
			this.messagesSubject$.pipe(
				filter((response: any) => response.correlationId === correlationId),
				timeout(10000),
				take(1),
				concatMap((response: any) => {
					if (response.action === `${message.action}:succeeded`) {
						return of(response.result);
					}
					throw new ResponseError(response.result);
				})
			)
		);
	}

	close() {
		this.socket$.complete();
	}

	subscribe(subscriber: (value: any) => void) {
		this.messagesSubject$.subscribe(subscriber);
	}
}
