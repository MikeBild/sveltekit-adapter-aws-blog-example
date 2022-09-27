import { Stack, aws_dynamodb, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';

export class DynamoDBStack extends Stack {
	constructor(scope, id, props) {
		super(scope, id, props);

		this.table = new aws_dynamodb.Table(this, 'data-table', {
			partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING },
			sortKey: { name: 'datatype', type: aws_dynamodb.AttributeType.STRING },
			removalPolicy: RemovalPolicy.DESTROY,
			billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST
		});

		new CfnOutput(this, 'TABLENAME', {
			value: this.table.tableName
		});
	}
}
