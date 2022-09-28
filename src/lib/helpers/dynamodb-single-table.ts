import { DynamoDB } from 'aws-sdk';

export interface DynamoDBConfig {
  tableName: string;
}

export default ({ tableName }: DynamoDBConfig) => {
  const ddb = new DynamoDB();

  return {
    async listByDataType<T>(dataType: string): Promise<T[]> {
      const result = await ddb
        .scan({
          TableName: tableName,
          ConsistentRead: true,
          FilterExpression: `#datatype = :datatype`,
          ExpressionAttributeValues: {
            ':datatype': { S: dataType }
          },
          ExpressionAttributeNames: {
            '#datatype': 'datatype'
          }
        })
        .promise();

      return result.Items?.map((x) => DynamoDB.Converter.unmarshall(x) as T) || [];
    },
    async get() {},
    async add() {},
    async update() {},
    async remove() {}
  };
};
