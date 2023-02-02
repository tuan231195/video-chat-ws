import { StackContext, Table } from '@serverless-stack/resources';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnAccount } from 'aws-cdk-lib/aws-apigateway';

export function IndexStack({ stack }: StackContext) {
	const connectionTable = new Table(stack, 'connections-table', {
		fields: {
			id: 'string',
			userId: 'string',
		},
		primaryIndex: { partitionKey: 'id' },
		globalIndexes: {
			user_id_index: {
				partitionKey: 'userId',
				projection: 'all',
			},
		},
	});

	const userTable = new Table(stack, 'users-table', {
		fields: {
			id: 'string',
		},
		primaryIndex: { partitionKey: 'id' },
	});

	const groupTable = new Table(stack, 'group-table', {
		fields: {
			id: 'string',
		},
		primaryIndex: { partitionKey: 'id' },
	});

	const groupUsersTable = new Table(stack, 'group-users-table', {
		fields: {
			groupId: 'string',
			userId: 'string',
		},
		globalIndexes: {
			user_id_index: {
				partitionKey: 'userId',
				projection: 'all',
			},
		},
		primaryIndex: { partitionKey: 'groupId', sortKey: 'userId' },
	});

	const messageTable = new Table(stack, 'messages-table', {
		fields: {
			groupId: 'string',
			userId: 'string',
			id: 'string',
		},
		globalIndexes: {
			user_id_index: {
				partitionKey: 'userId',
				projection: 'all',
			},
			group_id_index: {
				partitionKey: 'groupId',
				projection: 'all',
			},
		},
		primaryIndex: { partitionKey: 'id' },
	});

	const cwRole = new Role(stack, 'CWRole', {
		assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
		managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs')],
	});

	const cfnAccount = new CfnAccount(stack, 'Account', {
		cloudWatchRoleArn: cwRole.roleArn,
	});
	stack.addOutputs({
		ConnectionTableArn: connectionTable.tableArn,
		ConnectionTableName: connectionTable.tableName,
		GroupTableArn: groupTable.tableArn,
		GroupTableName: groupTable.tableName,
		GroupUsersTableArn: groupUsersTable.tableArn,
		GroupUsersTableName: groupUsersTable.tableName,
		MessagesTableArn: messageTable.tableArn,
		MessagesTableName: messageTable.tableName,
		UsersTableArn: userTable.tableArn,
		UsersTableName: userTable.tableName,
	});

	return {
		connectionTable,
		groupUsersTable,
		messageTable,
		userTable,
		groupTable,
		cfnAccount,
		cwRole,
	};
}
