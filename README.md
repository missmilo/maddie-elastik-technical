## AWS Amplify Next.js Elastik Student Search

## Requirements

* Node.js 
* npm 
* AWS CLI (for authentication)
* AWS Amplify CLI (optional, for local development)
* AWS Account


## 🧪 Local Development

To spin up the project locally:

### 1. Install dependencies

```
npm install
```

### 2. Start the frontend and API routes (Next.js)

```
npm run dev
```

This runs the Next.js development server, including both:

* the frontend React UI
* any local API routes under /pages/api or /app/api


### 3. Authenticate with your AWS environment

Authenticate with AWS using Single Sign-On to access cloud-based services like Amplify Functions and DynamoDB.

```
aws sso login
```

### 4. Run the Amplify sandbox 

This runs the Amplify Sandbox that will automatically hot reload your backend code changes for cloud based resources like Lambdas.

```
npx ampx sandbox --profile default
```

## Separation of Concerns
This app has three distinct layers:

#### Frontend (Next.js)
Runs locally with npm run dev. Handles the UI and client-side logic.

#### Backend APIs
If using Next.js API routes, they run locally.
If using Amplify Functions (Lambdas), they run in the cloud and are accessed via API Gateway.

#### Infrastructure & Data
Managed via AWS Amplify (DynamoDB, Auth, APIs). Accessed securely through aws sso login and tools like the Amplify CLI or Sandbox.

##  🚀 Deployments

Deployments are handled automatically by AWS Amplify on push to the main branch.