export class ResponseError extends Error {
	constructor(readonly errors: any[]) {
		super('Response error');
	}
}
