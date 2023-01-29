const COMMAND = 'command';

export const allCommands: Record<string, any> = {};
export const Command =
	(name: string): ClassDecorator =>
	(target) => {
		allCommands[name] = target;
		return Reflect.defineMetadata(COMMAND, name, target);
	};

export const getCommand = (commandClass: any) => Reflect.getMetadata(COMMAND, commandClass);
