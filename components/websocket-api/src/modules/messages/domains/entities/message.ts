import { IsNotEmpty, IsString } from 'class-validator';

export class Message {
	@IsNotEmpty()
	@IsString()
	body!: string;
}
