import { handler } from './handler';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';


const sendMock = jest.fn();

const mockClient = {
    send: sendMock,
} as unknown as DynamoDBDocumentClient;

const mockResult = {
    Count: 1,
    Items: [{
        id: '123',
        firstName: 'Test',
        lastName: 'User',
        dob: '1990-01-01',
        schoolName: 'Test School',
        schoolCoordinatorName: 'Test Coordinator',
        schoolTeacherName: 'Test Teacher',
    }],
    LastEvaluatedKey: { id: '456' },
}

describe('get-students Lambda', () => {
    beforeEach(() => {
        sendMock.mockReset();
    });

    it('returns student data and LastEvaluatedKey', async () => {

        sendMock.mockResolvedValueOnce(mockResult);

        const event = {
            queryStringParameters: { limit: '1' },
        };

        const response = await handler(event as any, mockClient);
        const body = JSON.parse(response.body);

        expect(response.statusCode).toBe(200);
        expect(body.students).toHaveLength(1);
        expect(body.nextToken).toBe(encodeURIComponent(JSON.stringify({ id: '456' })));
        expect(sendMock).toHaveBeenCalledWith(expect.any(ScanCommand));
    });
});
