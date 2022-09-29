import pkg from 'aws-sdk';
const { DynamoDB } = pkg;

export interface Entity {
  id: string;
}

export default (tableName: string) => {
  const ddb = new DynamoDB();

  return (dataType: string) => ({
    list: <T>() => list<T>(tableName, dataType),
    get: <T>(id: string) => get<T>(id, tableName, dataType),
    put: <T extends Entity>(item: T) => put(item, tableName, dataType),
    remove: (id: string) => remove(id, tableName, dataType)
  });

  async function list<T>(
    tableName: string,
    dataType: string,
    items: T[] = [],
    startKey?: any
  ): Promise<T[]> {
    const result = await ddb
      .scan({
        TableName: tableName,
        ExclusiveStartKey: startKey,
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

    if (result.Items) {
      items = [...items, ...result.Items.map((x: any) => DynamoDB.Converter.unmarshall(x) as T)];
    }

    if (result.LastEvaluatedKey) {
      return await list(tableName, dataType, items, result.LastEvaluatedKey);
    }

    return items;
  }

  async function get<T>(
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

  async function put<T extends Entity>(
    item: T,
    tableName: string,
    dataType: string
  ): Promise<void> {
    const existing = await get<T>(item.id, tableName, dataType);

    await ddb
      .putItem({
        TableName: tableName,
        Item: DynamoDB.Converter.marshall({
          ...existing,
          ...item,
          datatype: dataType
        })
      })
      .promise();
  }

  async function remove(id: string, tableName: string, dataType: string): Promise<void> {
    await ddb
      .deleteItem({
        TableName: tableName,
        Key: DynamoDB.Converter.marshall({
          id,
          datatype: dataType
        })
      })
      .promise();
  }
};
