
import { DynamoDBDocumentClient, ScanCommand, ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getClient, getNextTokenURI, parseLimit, parseNextToken } from './helpers';

export const handler = async (
  event: APIGatewayProxyEvent,
  injectedClient?: DynamoDBDocumentClient
): Promise<APIGatewayProxyResult> => {

  try {

    const client = getClient(injectedClient);
    const limit = parseLimit(event);
    console.log('Limit: ', limit);
    const nextToken = parseNextToken(event);
    console.log('Next Token: ', nextToken);

    //TODO: Remove hard coded table name
    const scanParams: ScanCommandInput = {
      TableName: "Students-yf2pbq7pojf4djod3rz6psnl4m-NONE",
      // Caps the number of items returned in the query 
      Limit: limit,
      // Tells DynamoDB where to resume from (if you already got page 1, this key gets you page 2)
      ExclusiveStartKey: nextToken,
    };

    // DynamoDB returns Items (results) and LastEvaluatedKey (next page - only if there are more items to fetch)
    const result: ScanCommandOutput = await client.send(new ScanCommand(scanParams));
    console.log('Result: ', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        students: result.Items ?? [],
        // Send the LastEvaluatedKey back to the client so they can use it to fetch the next page
        nextToken: getNextTokenURI(result),
      }),
    };

  } catch (error) {
    // Log the full error to CloudWatch
    console.error(error);
    // Return a 500 error to the client
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify({
        message: 'Internal server error.',
      }),
    };
  }
};
