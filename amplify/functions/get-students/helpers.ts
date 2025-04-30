import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


export const parseLimit = (event: APIGatewayProxyEvent): number => {
    return event.queryStringParameters?.limit
        ? parseInt(event.queryStringParameters.limit, 10)
        : 20;
}

export const parseNextToken = (event: APIGatewayProxyEvent) => {
    return event.queryStringParameters?.nextToken
        ? JSON.parse(decodeURIComponent(event.queryStringParameters.nextToken))
        : undefined;
}

export const getNextTokenURI = (result: ScanCommandOutput): string | null => {
    return result.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
        : null;
}

export const getClient = (
    injectedClient?: Partial<DynamoDBDocumentClient>
): DynamoDBDocumentClient => {
    if (
        !injectedClient ||
        typeof injectedClient.send !== 'function'
    ) {
        return DynamoDBDocumentClient.from(new DynamoDBClient({}));
    }
    // TODO: Fix unsafe cast
    return injectedClient as DynamoDBDocumentClient;
};

