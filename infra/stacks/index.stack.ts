import { StackContext, Table } from '@serverless-stack/resources';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnAccount } from 'aws-cdk-lib/aws-apigateway';

export function IndexStack({ stack }: StackContext) {
	const connectionTable = new Table(stack, 'connections-table', {
		fields: {
			id: 'string',
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
	});

	return {
		connectionTable,
		cfnAccount,
		cwRole,
	};
}
