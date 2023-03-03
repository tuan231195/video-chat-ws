import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { chunk, uniqBy } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_TOKEN } from '@vdtn359/nestjs-bootstrap';
import type { Config } from 'src/config';

@Injectable()
export class DynamoDbService {
	client: DynamoDBClient;

	documentClient: DynamoDBDocument;

	constructor(@Inject(CONFIG_TOKEN) private readonly config: Config) {
		this.client = new DynamoDBClient(config.get('DYNAMODB_CONFIG'));
		this.documentClient = DynamoDBDocument.from(this.client, {
			marshallOptions: {
				removeUndefinedValues: true,
				convertClassInstanceToMap: true,
			},
		});
	}

	async get(tableName: string, key: Record<string, any>): Promise<any> {
		const { Item } = await this.documentClient.get({
			Key: key,
			TableName: tableName,
		});

		return Item;
	}

	async upsert(tableName: string, key: Record<string, any>, item: Record<string, any>) {
		const { Item: existingItem } = await this.documentClient.get({
			TableName: tableName,
			Key: key,
		});
		const { Attributes: oldItem } = await this.documentClient.put({
			TableName: tableName,
			Item: {
				...existingItem,
				...key,
				...item,
			},
			ReturnValues: 'ALL_OLD',
		});
		return {
			...oldItem,
			...item,
		};
	}

	async putItem(tableName: string, item: Record<string, any>) {
		const { Attributes: oldItem } = await this.documentClient.put({
			TableName: tableName,
			Item: item,
			ReturnValues: 'ALL_OLD',
		});
		return {
			...oldItem,
			...item,
		};
	}

	async destroyItem(tableName: string, key: Record<string, any>) {
		const { Attributes: Item } = await this.documentClient.delete({
			TableName: tableName,
			Key: key,
		});
		return Item;
	}

	async batchGet(tableName: string, keys: Record<string, any>[]) {
		const uniqueKeys = uniqBy(keys, (value) => JSON.stringify(value));
		// dynamodb allows up to 25 updates in bulk
		const batches = chunk(uniqueKeys, 25);

		const items: any[] = [];
		for (const batch of batches) {
			// eslint-disable-next-line no-await-in-loop
			const { Responses } = await this.documentClient.batchGet({
				RequestItems: {
					[tableName]: {
						Keys: batch,
					},
				},
			});
			items.push(...(Responses?.[tableName] ?? []));
		}
		return items;
	}

	async queryAll({
		tableName,
		key: keyObject,
		indexName,
	}: {
		tableName: string;
		key: Record<string, string | number>;
		indexName?: string;
	}) {
		let lastEvaluatedKey = null;
		const allItems: any[] = [];
		do {
			// eslint-disable-next-line no-await-in-loop
			const result: any = await this.query({
				tableName,
				key: keyObject,
				indexName,
				...(lastEvaluatedKey && { lastEvaluatedKey }),
			});
			lastEvaluatedKey = result.lastEvaluatedKey;
			allItems.push(...(result.items || []));
		} while (lastEvaluatedKey);

		return allItems;
	}

	async query({
		tableName,
		key: keyObject,
		indexName,
		limit,
		lastEvaluatedKey,
	}: {
		tableName: string;
		key: Record<string, string | number>;
		indexName?: string;
		limit?: number;
		lastEvaluatedKey?: Record<string, any>;
	}) {
		const keys = Object.keys(keyObject);
		const expressionAttributesValues = keys.reduce(
			(agg, key) => ({
				...agg,
				[`:${key}`]: keyObject[key],
			}),
			{}
		);
		const expressionAttributesNames = keys.reduce(
			(agg, key) => ({
				...agg,
				[`#${key}`]: key,
			}),
			{}
		);
		const keyConditionExpression = keys.map((key) => `#${key} = :${key}`).join(' AND ');
		const { Items = [], LastEvaluatedKey: nextEvaluatedKey } = await this.documentClient.query({
			TableName: tableName,
			ExpressionAttributeValues: expressionAttributesValues,
			ExpressionAttributeNames: expressionAttributesNames,
			KeyConditionExpression: keyConditionExpression,
			ScanIndexForward: false,
			IndexName: indexName,
			Limit: limit,
			ExclusiveStartKey: lastEvaluatedKey,
		});

		return {
			items: Items,
			lastEvaluatedKey: nextEvaluatedKey,
		};
	}

	async batchPut({ tableName, items }: { tableName: string; items: any[] }) {
		// dynamodb allows up to 25 updates in bulk
		const batches = chunk(items, 25);

		for (const batch of batches) {
			// eslint-disable-next-line no-await-in-loop
			await this.documentClient.batchWrite({
				RequestItems: {
					[tableName]: batch.map((item) => ({
						PutRequest: {
							Item: item,
						},
					})),
				},
			});
		}
	}
}
