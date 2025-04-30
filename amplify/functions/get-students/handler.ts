import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const ddbClient = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(ddbClient);

const parseLimit = (event: APIGatewayProxyEvent) => {
  return event.queryStringParameters?.limit
   ? parseInt(event.queryStringParameters.limit, 10)
    : 20;
}

const parseNextToken = (event: APIGatewayProxyEvent) => {
  return event.queryStringParameters?.nextToken
  ? JSON.parse(decodeURIComponent(event.queryStringParameters.nextToken))
    : undefined;
}

const getNextTokenURI = (result: ScanCommandOutput) => {
  return result.LastEvaluatedKey
  ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
  : null;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  injectedClient = docClient
): Promise<APIGatewayProxyResult> => {

  const limit = parseLimit(event);
  const nextToken = parseNextToken(event);

  //TODO: Remove hard coded table name
  const scanParams = {
    TableName: "Students-yf2pbq7pojf4djod3rz6psnl4m-NONE",
    // Caps the number of items returned in the query 
    Limit: limit,
    // Tells DynamoDB where to resume from (if you already got page 1, this key gets you page 2)
    ExclusiveStartKey: nextToken,
  };

  // DynamoDB returns Items (results) and LastEvaluatedKey (next page - only if there are more items to fetch)
  const result = await injectedClient.send(new ScanCommand(scanParams));

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
};
