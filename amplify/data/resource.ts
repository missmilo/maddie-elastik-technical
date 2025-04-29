import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Students: a.model({
    firstName: a.string(),
    lastName: a.string(),
    dob: a.string(), //milliseconds from epoch
    schoolName: a.string(),
    schoolCoordinatorName: a.string(),
    schoolTeacherName: a.string(),
    email: a.string(),
  }).authorization((allow) => [
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
