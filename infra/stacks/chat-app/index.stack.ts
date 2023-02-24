import { StackContext, StaticSite } from '@serverless-stack/resources';
import { config as loadConfig } from 'dotenv-flow';

export function IndexStack({ stack }: StackContext) {
	loadConfig({
		path: 'frontends/chat-app',
	});

	const staticSite = new StaticSite(stack, 'chat-app', {
		path: 'frontends/chat-app/dist',
	});
	stack.addOutputs({
		StaticSiteUrl: staticSite.url,
	});
	return {
		staticSite,
	};
}
