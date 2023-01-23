import { IsNotEmpty, IsString } from 'class-validator';
import { BaseCommand } from 'src/modules/websocket/domains/commands/base.command';

export class AuthenticateCommand implements BaseCommand {
	@IsNotEmpty()
	@IsString()
	name!: string;

	type = 'authenticate' as const;
}
