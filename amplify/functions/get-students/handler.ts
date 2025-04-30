import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';


const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event: { queryStringParameters?: { limit?: string; nextToken?: string } }) => {

  const tableName = process.env.TABLE_NAME!;

  console.log("Table Name:", tableName);
  console.log("Fetching student records from DynamoDB");


  const limit = event.queryStringParameters?.limit
    ? parseInt(event.queryStringParameters.limit, 10)
    : 20;

  console.log("Limit:", limit);

  const nextToken = event.queryStringParameters?.nextToken
    ? JSON.parse(decodeURIComponent(event.queryStringParameters.nextToken))
    : undefined;

  console.log("Next Token:", nextToken);

  //TODO: Remove hardcoded table name
  const scanParams = {
    TableName: "Students-yf2pbq7pojf4djod3rz6psnl4m-NONE",
    Limit: limit,
    ExclusiveStartKey: nextToken,
  };

  console.log("Scan Parameters:", scanParams);

  const scanCommand = new ScanCommand(scanParams);
  const result = await docClient.send(scanCommand);

  console.log("Scan Result Count:", result.Count);

  const response = {
    students: result.Items ?? [],
    nextToken: result.LastEvaluatedKey
      ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
      : null,
  };

  //TODO: Handle errors
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // CORS for localhost and Amplify frontend
      'Access-Control-Allow-Methods': 'GET',
    },
    body: JSON.stringify(response),
  };
  console.log('Fetched students successfully');
};