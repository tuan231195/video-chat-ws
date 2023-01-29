import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { DynamoDbService } from './dynamo.service';

export abstract class BaseRepository<T = any> {
	private dataLoaders: Record<string, DataLoader<Record<string, any>, T>> = {};

	protected constructor(dynamodbService: DynamoDbService, tableName: string, allKeys: string[][]) {
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

	load(keyObject: Record<string, any>) {
		const keys = Object.keys(keyObject);
		return this.dataLoaders[this.serialiseKeys(keys)].load(keyObject);
	}
}
