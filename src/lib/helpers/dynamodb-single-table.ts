import pkg from 'aws-sdk';
const { DynamoDB } = pkg;

export interface Entity {
  id: string;
}

export default (tableName: string) => {
  const ddb = new DynamoDB();

  return (dataType: string) => ({
    listAll: () => listAll(tableName, dataType),
    getById: (id: string) => getById(id, tableName, dataType),
    upsert: <T extends Entity>(item: T) => upsert(item, tableName, dataType),
    remove: (id: string) => remove(id, tableName, dataType)
  });

  async function listAll<T extends Entity>(
    tableName: string,
    dataType: string
  ): Promise<T[] | undefined> {
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

  async function getById<T extends Entity>(
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

  async function upsert<T extends Entity>(
    item: T,
    tableName: string,
    dataType: string
  ): Promise<void> {
    const existing = await getById(item.id, tableName, dataType);
    
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
