import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DynamoDbService } from './dynamo.service';

export abstract class BaseRepository<T = any> {
	private dataLoaders: Record<string, DataLoader<Record<string, any>, T>> = {};

	protected constructor(
		protected readonly dynamodbService: DynamoDbService,
		protected readonly clazz: Type<T>,
		protected tableName: string,
		allKeys: string[][]
	) {
		for (const keys of allKeys) {
			this.dataLoaders[this.serialiseKeys(keys)] = new DataLoader<Record<string, any>, any>(
				async (keysObjects) => {
					const items = await dynamodbService.batchGet(tableName, keysObjects as any);
					const groupMap = keyBy(items, (item) => JSON.stringify(keys.map((key) => item[key])));
					return keysObjects.map((keyObject) => {
						const stringifyKeys = JSON.stringify(keys.map((key) => keyObject[key]));
						return groupMap[stringifyKeys];
					});
				},
				{
					cache: false,
				}
			);
		}
	}

	private serialiseKeys = (keys: string[]) => JSON.stringify(keys.sort());

	load(keyObject: Record<string, any>): Promise<T | null> {
		const keys = Object.keys(keyObject);
		return this.dataLoaders[this.serialiseKeys(keys)].load(keyObject);
	}

	save(record: Record<string, any>) {
		return this.dynamodbService.putItem(this.tableName, record).then((item) => plainToInstance(this.clazz, item));
	}

	delete(record: Record<string, any>) {
		return this.dynamodbService.destroyItem(this.tableName, record);
	}

	update(key: Record<string, any>, record: Record<string, any>) {
		return this.dynamodbService
			.upsert(this.tableName, key, record)
			.then((item) => plainToInstance(this.clazz, item));
	}

	get(key: Record<string, any>) {
		return this.dynamodbService
			.get(this.tableName, key)
			.then((item) => (item ? plainToInstance(this.clazz, item) : null));
	}

	query({
		key: keyObject,
		indexName,
		limit,
		lastEvaluatedKey,
	}: {
		key: Record<string, string | number>;
		indexName?: string;
		limit?: number;
		lastEvaluatedKey?: Record<string, any>;
	}): Promise<{ items: T[]; lastEvaluatedKey?: any }> {
		return this.dynamodbService
			.query({
				tableName: this.tableName,
				key: keyObject,
				indexName,
				limit,
				lastEvaluatedKey,
			})
			.then(({ items = [], lastEvaluatedKey: nextEvaluatedKey }) => ({
				items: items.map((item: Record<string, any>) => plainToInstance(this.clazz, item)),
				lastEvaluatedKey: nextEvaluatedKey,
			}));
	}

	queryAll({ key: keyObject, indexName }: { key: Record<string, string | number>; indexName?: string }) {
		return this.dynamodbService
			.queryAll({
				tableName: this.tableName,
				key: keyObject,
				indexName,
			})
			.then((items) => items.map((item) => plainToInstance(this.clazz, item)));
	}
}
