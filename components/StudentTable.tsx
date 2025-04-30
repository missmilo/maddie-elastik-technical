'use client';

import * as React from 'react';
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
} from '@aws-amplify/ui-react';
import { get } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setFilter } from '@/store/slices/studentSlice';

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
  const query = nextToken ? `?nextToken=${encodeURIComponent(nextToken)}` : '';
  const restOperation = get({
    apiName: 'myRestApi',
    path: `items${query}`,
  });

  const { body } = await restOperation.response;
  return (await body.json()) as unknown as StudentResponse;
}

export const StudentTable = () => {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [pageTokens, setPageTokens] = React.useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const filter = useSelector((state: RootState) => state.student.filter);
  const dispatch = useDispatch<AppDispatch>();

  const handleFilterChange = (value: string) => {
    dispatch(setFilter(value));
    // no URL sync — local state only
  };

  const loadPage = async (pageIndex: number) => {
    setLoading(true);

    const token = pageTokens[pageIndex - 1] ?? undefined;

    try {
      const result = await fetchStudents(token);
      setStudents(result.students ?? []);
      setCurrentPageIndex(pageIndex);

      if (result.nextToken && pageTokens.length === pageIndex) {
        setPageTokens([...pageTokens, result.nextToken]);
        setHasMorePages(true);
      } else if (!result.nextToken) {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    }

    setLoading(false);
  };

  // Load first page on mount
  React.useEffect(() => {
    void loadPage(1);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.firstName.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <View className="p-4 bg-white text-black rounded shadow-md">
      <Flex direction="row" alignItems="center" className="mb-4">
        <Text as="label" htmlFor="filterInput" className="mr-2">
          Filter by First Name:
        </Text>
        <input
          id="filterInput"
          type="text"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border p-1 rounded text-black"
        />
      </Flex>

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
          {filteredStudents.map((student, index) => (
            <TableRow
              key={student.id}
              className={index % 2 === 0 ? 'bg-white text-black' : 'bg-gray-50 text-black'}
            >
              <TableCell>
                {(currentPageIndex - 1) * students.length + index + 1}
              </TableCell>
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
          onNext={() => {
            if (currentPageIndex < pageTokens.length) {
              void loadPage(currentPageIndex + 1);
            }
          }}
          onPrevious={() => {
            if (currentPageIndex > 1) {
              void loadPage(currentPageIndex - 1);
            }
          }}
          onChange={(newPageIndex) => {
            if (typeof newPageIndex === 'number') {
              void loadPage(newPageIndex);
            }
          }}
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
