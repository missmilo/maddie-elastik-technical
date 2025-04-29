"use client";

import { Button } from "@aws-amplify/ui-react";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { get } from 'aws-amplify/api';

export async function getItem() {
  try {
    const restOperation = get({
      apiName: 'myRestApi', 
      path: 'items', 
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('GET call succeeded');
    console.log(response);
    return response;
  } catch (error: any) {
    console.error('GET call failed:', error);
    if (error.response) {
      const errorBody = await error.response.body.text();
      console.error('Error response body:', errorBody);
    }
  }
}



export const StudentTable = () => {

  const handleClick = async () => {
    try {
      await getItem();
    } catch (error) {
      console.error('Failed to get item', error);
    }
  };
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

      <Button onClick={handleClick}>Get Item</Button>

    </div>
  );
}
