import { IsNotEmpty, IsString } from 'class-validator';
import { Command } from 'src/modules/command/domains/commands/decorator';
import { BaseCommand } from 'src/modules/command/domains';

@Command('group:create')
export class CreateGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	name!: string;
}
