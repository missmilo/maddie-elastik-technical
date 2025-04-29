import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event: { queryStringParameters?: { limit?: string; nextToken?: string } }) => {
  try {
    console.log('Fetching students...');
    console.log('Running new lambda function');
    console.log('Making sure this is the right lambda function');

    // Extract query string parameters for pagination
    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit, 10)
      : 20; // Default limit
    const nextToken = event.queryStringParameters?.nextToken
      ? JSON.parse(decodeURIComponent(event.queryStringParameters.nextToken))
      : undefined; // Use undefined if no token

    // Build the ScanCommand input
    const scanParams = {
      TableName: 'Students',
      Limit: limit,
      ExclusiveStartKey: nextToken,
    };

    const scanCommand = new ScanCommand(scanParams);
    const result = await docClient.send(scanCommand);

    const response = {
      students: result.Items ?? [],
      nextToken: result.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
        : null,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORS for localhost and Amplify frontend
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(response),
    };
    console.log('Fetched students successfully');
  } catch (error) {
    console.error('Error fetching students:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Ensure even error responses have CORS
      },
      body: JSON.stringify({ message: error }),
    };
  }
};
