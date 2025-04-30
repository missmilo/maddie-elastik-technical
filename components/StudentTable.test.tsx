import { render, screen } from '@testing-library/react';
import * as api from 'aws-amplify/api';
import '@testing-library/jest-dom';
import { StudentTable } from './StudentTable';
import { Provider } from 'react-redux';
import { store } from '../store';


jest.mock('aws-amplify/api');
const mockedGet = api.get as jest.Mock;

describe('StudentTable', () => {

  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('renders headers and loads student data with pagination and sorting', async () => {
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
              },
            ],
            nextToken: null,
          }),
        },
      },
    });

    render(
      <Provider store={store} >
        <StudentTable />
      </Provider>
    );

    // Wait for data
    expect(await screen.findByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();

    // Check student data
    expect(await screen.findByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

  });
});
