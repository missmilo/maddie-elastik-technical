"use client";

import "./../app/app.css";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import AuthWrapper from "@/components/AuthWrapper";
import { Amplify } from 'aws-amplify';
import { UserProfile } from "@/components/UserProfile";



Amplify.configure(outputs);



export default function App() {
 
  return (
    <AuthWrapper>
      <main>      
        <UserProfile />
      </main>
    </AuthWrapper>
  );
}
