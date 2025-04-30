'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';


export const NavBar = () => {
    const { user, signOut } = useAuthenticator();

    const [attributes, setAttributes] = useState<Record<string, string> | null>(null);

    useEffect(() => {
      const getUserAttributes = async () => {
        try {
          const userAttrs = await fetchUserAttributes();
          setAttributes(userAttrs as Record<string, string>);
        } catch (error) {
          console.error('Failed to fetch user attributes:', error);
        }
      };
  
      getUserAttributes();
    }, []);

    const displayName =
        attributes?.given_name || attributes?.name || attributes?.username;

    const email = attributes?.email || user?.signInDetails?.loginId;
    const picture = attributes?.picture || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Elastik Student Search</a>
            </div>

            {user && (
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-700">{displayName}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="User avatar" src={picture} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <button onClick={signOut}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
