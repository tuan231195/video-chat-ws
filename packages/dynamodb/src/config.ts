import type { Config as ConfigType, Schema } from 'convict';

export const dynamodbConfig = {
	DYNAMODB_CONFIG: {
		format: Object,
		nullable: false,
		default: { region: 'ap-southeast-2' },
	},
	AWS_SDK_CONFIG: {
		format: Object,
		nullable: false,
		default: { region: 'ap-southeast-2' },
	},
};

export type Config = ConfigType<Schema<typeof dynamodbConfig>>;
