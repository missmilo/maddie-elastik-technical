"use client";

import "./../app/app.css";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Amplify } from 'aws-amplify';
import { StudentTable } from "@/components/StudentTable";
import { NavBar } from "@/components/NavBar";
import { parseAmplifyConfig } from "aws-amplify/utils";
import { Provider } from 'react-redux';
import { store } from '@/store';


Amplify.configure(outputs);

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure(
  {
    ...amplifyConfig,
    API: {
      ...amplifyConfig.API,
      REST: outputs.custom.API,
    },
  },
  {
    API: {
      REST: {
        retryStrategy: {
          strategy: 'no-retry' // Overrides default retry strategy
        },
      }
    }
  }
);

export default function App() {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <main>
          <NavBar />
          <StudentTable />
        </main>
      </AuthWrapper>
    </Provider>
  );
}
