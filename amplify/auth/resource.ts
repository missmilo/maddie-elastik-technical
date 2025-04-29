import { type ClientSchema, a, defineData, type AuthorizationBuilder } from '@aws-amplify/backend';

const schema = a.schema({
  UserProfile: a.model({
    firstName: a.string(),
    lastName: a.string(),
    userID: a.string(),
    email: a.string(),
  }).authorization((allow: AuthorizationBuilder) => [
    allow.owner(),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
