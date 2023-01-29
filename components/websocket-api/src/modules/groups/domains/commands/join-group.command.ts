import { Command } from 'src/modules/command/domains/commands/decorator';
import { BaseCommand } from 'src/modules/command/domains';
import { IsNotEmpty, IsString } from 'class-validator';

@Command('group:join')
export class JoinGroupCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;
}
