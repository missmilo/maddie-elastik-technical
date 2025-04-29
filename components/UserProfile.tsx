"use client";

import { useState, useEffect } from "react";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export function UserProfile() {
  const { user, signOut } = useAuthenticator();
  const [userProfile, setUserProfile] = useState<Schema["UserProfile"]["type"]>();

  function loadUserProfile() {
    if (!user) return;

    client.models.UserProfile.observeQuery({
      filter: {
        userID: { eq: user.username }, 
      },
    }).subscribe({
      next: (data) => {
        if (data.items.length > 0) {
          setUserProfile(data.items[0]);
        } else {
          setUserProfile(undefined); 
        }
      },
    });
  }

  useEffect(() => {
    loadUserProfile();
  }, [user?.username]); 

  function createUserProfile() {
    if (!user) return;

    const firstName = window.prompt("First Name") ?? "";
    const lastName = window.prompt("Last Name") ?? "";

    client.models.UserProfile.create({
      userID: user.username,
      firstName,
      lastName,
      email: user.signInDetails?.loginId ?? "", // fallback for email
    });
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
        <div>
          <p>Signed in as: {user?.username}</p>
          <p>Name: {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "No profile yet"}</p>
          <p>Email: {userProfile?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {!userProfile && (
            <button onClick={createUserProfile}>Create Profile</button>
          )}
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>
    </>
  );
}
