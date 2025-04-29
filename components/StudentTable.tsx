"use client";

//import { useEffect } from "react";
//import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
//import { useAuthenticator } from "@aws-amplify/ui-react";
//import { generateClient } from "aws-amplify/data";

//const client = generateClient<Schema>();

export const StudentTable = () => {

  //const { user, signOut } = useAuthenticator();
  //const [studentArray, setStudentArray] = useState<Array<Schema["Students"]["type"]>>([]);

  //const loadStudentData = () => {
  //  if (!user) return;
  //}

  //useEffect(() => {
  //  loadStudentData();
  //}, [user?.username]);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>School Name</th>
            <th>School Coordinator Name</th>
            <th>School Teacher Name</th>           
          </tr>
        </thead>
        <tbody>         
          <tr>         
            <th>1</th>   
            <td>Jane</td>
            <td>Doe</td>
            <td>01/01/2000</td>
            <td>jane.doe@gmail.com</td>
            <td>Armadale Primary</td>
            <td>John Smith</td>
            <td>Catherine Grace</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
