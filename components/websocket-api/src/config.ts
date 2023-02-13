import 'dotenv-flow/config';
import { createConfig } from '@vdtn359/nestjs-bootstrap';
import { dynamodbConfig } from '@vdtn359/dynamodb-nestjs-module';

export const config = async () => {
	let fetchedConfig: Record<string, string>;
	const configProxy = (wrapper: any) =>
		new Proxy(wrapper, {
			get(obj: any, prop: string) {
				try {
					return obj[prop] ?? process.env[prop] ?? null;
				} catch (err) {
					return null;
				}
			},
		});
	try {
		fetchedConfig = await import('@serverless-stack/node/config').then(({ Config }) => configProxy(Config));
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('Failed to load config', { err });
		fetchedConfig = configProxy(process.env);
	}
	return createConfig(
		{
			APP_HOST: {
				format: String,
				nullable: false,
				default: '0.0.0.0',
			},
			PORT: {
				format: 'port',
				default: 8080,
			},
			CONNECTIONS_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			GROUPS_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			USERS_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			VIDEO_CALL_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			VIDEO_CALL_USERS_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			MESSAGES_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			GROUP_USERS_TABLE: {
				format: String,
				nullable: false,
				default: null,
			},
			JWT_SECRET: {
				format: String,
				nullable: false,
				default: null,
			},
			...dynamodbConfig,
		},
		fetchedConfig
	);
};

export type Config = Awaited<ReturnType<typeof config>>;
