import type { Likes } from '$lib/models/Likes';
import type { Posts } from '$lib/models/Posts';
import { DynamoDB } from 'aws-sdk';
import { TABLENAME } from '$env/static/private';

const ddb = new DynamoDB();

export async function getPosts() {
	const data = Object.entries(import.meta.glob('../../routes/posts/**/*.svx', { eager: true }));

	return data.reduce(
		(previous, [url, obj]: [string, any]) => ({
			...previous,
			[url.replace('../../routes', '').replace('/+page.svx', '')]: obj.metadata
		}),
		{} as Posts
	);
}

export async function getLikes(): Promise<Likes> {
	const result = await ddb
		.scan({
			TableName: TABLENAME,
			ConsistentRead: true,
			FilterExpression: `#datatype = :like`,
			ExpressionAttributeValues: {
				':like': { S: 'like' }
			},
			ExpressionAttributeNames: {
				'#datatype': 'datatype'
			}
		})
		.promise();

	return (
		result.Items?.map((x) => DynamoDB.Converter.unmarshall(x)).reduce(
			(p, n) => ({
				...p,
				[n.id]: n.value
			}),
			{}
		) || {}
	);
}

export async function addLike(id: string): Promise<void> {
	const result = await ddb
		.getItem({
			TableName: TABLENAME,
			ConsistentRead: true,
			Key: DynamoDB.Converter.marshall({
				id,
				datatype: 'like'
			})
		})
		.promise();

	const likeToUpdate = result.Item && DynamoDB.Converter.unmarshall(result.Item);

	await ddb
		.putItem({
			TableName: TABLENAME,
			Item: DynamoDB.Converter.marshall({
				id,
				datatype: 'like',
				value: likeToUpdate?.value ? likeToUpdate.value + 1 : 1
			})
		})
		.promise();
}
