import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { v4 as uuidv4 } from 'uuid';
import { catchError, concatMap, EMPTY, filter, lastValueFrom, of, Subject, take, tap, timeout } from 'rxjs';
import { Logger } from 'src/lib/logger';

type Message = Record<string, any> & {
	action: string;
};

class ResponseError extends Error {
	constructor(readonly errors: any[]) {
		super('Response error');
	}
}

export class SocketService {
	private socket$!: WebSocketSubject<any>;

	private messagesSubject$ = new Subject();

	public connect(): void {
		if (!this.socket$ || this.socket$.closed) {
			this.socket$ = this.getNewWebSocket();
			this.socket$
				.pipe(
					tap({
						error: Logger.error,
					}),
					catchError(() => EMPTY)
				)
				.subscribe(this.messagesSubject$);
		}
	}

	private getNewWebSocket() {
		return webSocket(
			'wss://eycdqsqu5m.execute-api.ap-southeast-2.amazonaws.com/dev?authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWYxMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.CPZC5MWC42XL_6fXA3ygnRk4xxSnjMp0B3zmETszhzY'
		);
	}

	sendMessage(msg: Message) {
		this.socket$.next(msg);
	}

	sendMessageAwaitResponse(message: Message) {
		const correlationId = uuidv4();
		this.socket$.next({
			...message,
			correlationId,
		});

		return lastValueFrom(
			this.messagesSubject$.pipe(
				filter((response: any) => response.correlationId === correlationId),
				timeout(5000),
				take(1),
				concatMap((response: any) => {
					if (response.action === `${message.action}:succeeded`) {
						return of(response.result);
					}
					throw new ResponseError(response.result?.errors);
				})
			)
		);
	}

	close() {
		this.socket$.complete();
	}
}
