import { render, screen, waitFor } from '@testing-library/react';
import * as api from 'aws-amplify/api';
import '@testing-library/jest-dom';
import { StudentTable } from './StudentTable';

jest.mock('aws-amplify/api');

const mockedGet = api.get as jest.Mock;


describe('StudentTable', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('renders headers and loads student data', async () => {
    // Arrange: mock response
    mockedGet.mockReturnValueOnce({
      response: {
        body: {
          json: async () => ({
            students: [
              {
                id: '1',
                firstName: 'Jane',
                lastName: 'Doe',
                dob: '2000-01-01',
                email: 'jane@example.com',
                schoolName: 'Test School',
                schoolCoordinatorName: 'John Smith',
                schoolTeacherName: 'Mary Johnson',
                createdAt: '',
                updatedAt: '',
              },
            ],
            nextToken: null,
          }),
        },
      },
    });

    // Act
    render(<StudentTable />);

    // Assert headers render
    expect(await screen.findByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();

    // Wait for the async data to load and verify it
    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });
});
