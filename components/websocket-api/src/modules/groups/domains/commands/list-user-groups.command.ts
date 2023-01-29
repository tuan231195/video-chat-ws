import { IsNotEmpty, IsString } from 'class-validator';
import { Command } from 'src/modules/command/domains/commands/decorator';
import { BaseCommand } from 'src/modules/command/domains';

@Command('user-groups:list')
export class ListUserGroupsCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	userId!: string;
}
