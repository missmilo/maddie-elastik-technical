import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { NavBar } from './NavBar';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import '@testing-library/jest-dom';

jest.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: jest.fn(),
}));

jest.mock('aws-amplify/auth', () => ({
  fetchUserAttributes: jest.fn(),
}));

describe('NavBar', () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuthenticator as jest.Mock).mockReturnValue({
      user: {
        signInDetails: {
          loginId: 'jane@example.com',
        },
      },
      signOut: mockSignOut,
    });
    (fetchUserAttributes as jest.Mock).mockResolvedValue({
      given_name: 'Jane',
      email: 'jane@example.com',
      picture: 'https://mock-avatar.com/avatar.png',
    });
  });

  it('renders the component and user info after fetching attributes', async () => {
    render(<NavBar />);
    expect(screen.getByText('Elastik Student Search')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('calls signOut when logout button is clicked', async () => {
    render(<NavBar />);
    const logOut = screen.getByTestId('logout-button');
    fireEvent.click(logOut);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
