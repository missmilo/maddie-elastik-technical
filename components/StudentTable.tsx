"use client";

import * as React from "react";
import {
  Pagination,
  View,
  Text,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Flex,
} from "@aws-amplify/ui-react";
import { get } from "aws-amplify/api";
import "@aws-amplify/ui-react/styles.css";

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
  nextToken?: string | null;
}

async function fetchStudents(nextToken?: string): Promise<StudentResponse> {
  const query = nextToken ? `?nextToken=${encodeURIComponent(nextToken)}` : "";
  const restOperation = get({
    apiName: "myRestApi",
    path: `items${query}`,
  });

  const { body } = await restOperation.response;
  return (await body.json()) as StudentResponse;
}

export const StudentTable = () => {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [pageTokens, setPageTokens] = React.useState<(string | null)[]>([null]); // null = first page
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const loadPage = async (pageIndex: number) => {
    setLoading(true);

    const token = pageTokens[pageIndex - 1]; // index is 1-based
    const result = await fetchStudents(token ?? undefined);

    setStudents(result.students ?? []);

    // If we're going forward and there's a new token, store it
    if (pageIndex === pageTokens.length && result.nextToken) {
      setPageTokens([...pageTokens, result.nextToken]);
      setHasMorePages(true);
    } else if (!result.nextToken) {
      setHasMorePages(false);
    }

    setCurrentPageIndex(pageIndex);
    setLoading(false);
  };

  React.useEffect(() => {
    loadPage(1); // load first page on mount
  }, []);

  return (
    <View className="p-4 bg-white text-black rounded shadow-md">
      <Table highlightOnHover={true}>
        <TableHead>
          <TableRow className="bg-gray-100 text-black">
            <TableCell as="th">#</TableCell>
            <TableCell as="th">First Name</TableCell>
            <TableCell as="th">Last Name</TableCell>
            <TableCell as="th">Date of Birth</TableCell>
            <TableCell as="th">Email</TableCell>
            <TableCell as="th">School Name</TableCell>
            <TableCell as="th">Coordinator</TableCell>
            <TableCell as="th">Teacher</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <TableRow
              key={student.id}
              className={index % 2 === 0 ? "bg-white text-black" : "bg-gray-50 text-black"}
            >
              <TableCell>{(currentPageIndex - 1) * students.length + index + 1}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.lastName}</TableCell>
              <TableCell>{student.dob}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.schoolName}</TableCell>
              <TableCell>{student.schoolCoordinatorName}</TableCell>
              <TableCell>{student.schoolTeacherName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Flex justifyContent="center" className="mt-4">
        <Pagination
          currentPage={currentPageIndex}
          totalPages={pageTokens.length}
          hasMorePages={hasMorePages}
          onNext={() => loadPage(currentPageIndex + 1)}
          onPrevious={() => loadPage(currentPageIndex - 1)}
          onChange={loadPage}
          isDisabled={loading}
        />
      </Flex>

      {loading && (
        <Text variation="tertiary" className="text-center mt-2">
          Loading students...
        </Text>
      )}
    </View>
  );
};
