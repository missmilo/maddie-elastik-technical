"use client";

import { useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { get } from "aws-amplify/api";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  schoolName: string;
  schoolCoordinatorName: string;
  schoolTeacherName: string;
  createdAt: string;
  updatedAt: string;
  __typename?: string;
}

interface StudentResponse {
  students: Student[];
}

export async function getItem(): Promise<StudentResponse | null> {
  try {
    const restOperation = get({
      apiName: "myRestApi",
      path: "items",
    });

    const { body } = await restOperation.response;
    const response = (await body.json() as unknown) as StudentResponse;

    console.log("GET call succeeded");
    console.log(response);
    return response;
  } catch (error) {
    console.error("GET call failed:", error);
    return null;
  }
}

export const StudentTable = () => {
  const [students, setStudents] = useState<Student[]>([]);

  const handleClick = async () => {
    try {
      const response = await getItem();
      if (response?.students?.length) {
        setStudents(response.students);
      }
    } catch (error) {
      console.error("Failed to get item", error);
    }
  };

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>School Name</th>
            <th>Coordinator</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <th>{index + 1}</th>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.dob}</td>
              <td>{student.email}</td>
              <td>{student.schoolName}</td>
              <td>{student.schoolCoordinatorName}</td>
              <td>{student.schoolTeacherName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4">
        <Button onClick={handleClick}>Load Students</Button>
      </div>
    </div>
  );
};
