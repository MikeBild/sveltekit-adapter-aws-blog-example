import pkg from 'aws-sdk';
const { DynamoDB } = pkg;

export interface DynamoDBConfig {
  tableName: string;
}

export default (tableName: string) => {
  const ddb = new DynamoDB();

  return (dataType: string) => ({
    listAll: <T>() => listAll<T>(tableName, dataType),
    getById: <T>(id: string) => getById<T>(id, tableName, dataType)
  });

  async function listAll<T>(tableName: string, dataType: string): Promise<T[] | undefined> {
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

    return result.Items?.map((x: any) => DynamoDB.Converter.unmarshall(x) as T) || undefined;
  }

  async function getById<T>(
    id: string,
    tableName: string,
    dataType: string
  ): Promise<T | undefined> {
    const result = await ddb
      .getItem({
        TableName: tableName,
        Key: DynamoDB.Converter.marshall({
          id,
          datatype: dataType
        })
      })
      .promise();

    return result.Item ? (DynamoDB.Converter.unmarshall(result.Item) as T) : undefined;
  }
  async function add() {}
  async function update() {}
  async function remove() {}
};
