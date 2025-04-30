'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';

export const ProfileCard = () => {
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


    const firstName = attributes?.given_name;
    const lastName = attributes?.family_name;
    const displayName = `${firstName} ${lastName}`;
    const email = attributes?.email || user?.signInDetails?.loginId
        ;
    const picture =
        attributes?.picture ||
        'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

    return (
        <div className="card w-full h-full bg-base-200 shadow-sm text-base-content">
            <div className="card-body items-center text-center">
                <div className="avatar mb-4">
                    <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={picture} alt="User avatar" />
                    </div>
                </div>
                <h2 className="card-title text-xl">{displayName}</h2>
                <p className="text-sm text-base-content/70">{email}</p>

                <ul className="mt-4 text-left text-sm w-full space-y-1">
                    <li>
                        <span className="font-medium">First Name: </span> {firstName}
                    </li>
                    <li>
                        <span className="font-medium">Last Name: </span> {lastName}
                    </li>                
                    <li>
                        <span className="font-medium">Email: </span> {email}
                    </li>
                    <li>
                        <span className="font-medium">Address: </span> {attributes?.address || '123 Fake Street'}
                    </li>
                    <li>
                        <span className="font-medium">Phone: </span> {attributes?.phone_number}
                    </li>
                </ul>

                <div className="mt-6 w-full">
                    <button onClick={signOut} className="btn btn-outline btn-error btn-block">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
