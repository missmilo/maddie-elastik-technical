'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator.Provider>
      <Authenticator signUpAttributes={['given_name', 'family_name', 'phone_number', 'gender', 'picture']}>
        {children}
      </Authenticator>
    </Authenticator.Provider>
  );
}


