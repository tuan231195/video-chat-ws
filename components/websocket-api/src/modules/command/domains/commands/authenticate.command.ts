import { IsNotEmpty, IsString } from 'class-validator';
import { BaseCommand } from 'src/modules/command/domains/commands/base.command';

export class AuthenticateCommand implements BaseCommand {
	@IsNotEmpty()
	@IsString()
	name!: string;

	action = 'authenticate' as const;
}
