import { App, aws_iam } from 'aws-cdk-lib';
import { AWSAdapterStack } from 'sveltekit-adapter-aws';
import { DynamoDBStack } from './dynamodb-stack.js';

const app = new App();
const env = {
	account: process.env.CDK_DEFAULT_ACCOUNT,
	region: process.env.CDK_DEFAULT_REGION
};
const { serverHandler } = new AWSAdapterStack(app, 'sveltekit-adapter-aws-webapp', { env });

serverHandler.addToRolePolicy(
	new aws_iam.PolicyStatement({
		effect: aws_iam.Effect.ALLOW,
		actions: ['ses:SendEmail'],
		resources: ['arn:aws:ses:eu-central-1:044086961882:identity/mikebild.com']
	})
);

const { table } = new DynamoDBStack(app, 'sveltekit-adapter-aws-webapp-ddb', { env });
table.grantReadWriteData(serverHandler);
