import { defineFunction } from "@aws-amplify/backend";

export const getStudents = defineFunction({
  name: "get-students",
  environment: {
    TABLE_NAME: 'Students', 
  },
});