import { IsNotEmpty, IsString } from 'class-validator';
import { Command } from 'src/modules/command/domains/commands/decorator';
import { BaseCommand } from 'src/modules/command/domains';

@Command('group-users:list')
export class ListGroupUsersCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}
