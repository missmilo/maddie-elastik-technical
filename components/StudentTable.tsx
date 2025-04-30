'use client';

import * as React from 'react';
import { get } from 'aws-amplify/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

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
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const filter = useSelector((state: RootState) => state.student.filter);

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

  React.useEffect(() => {
    void loadPage(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredStudents = students
    .filter((student) => {
      const matchFirstName = filter.firstName
        ? student.firstName.toLowerCase().includes(filter.firstName.toLowerCase())
        : true;

      const matchLastName = filter.lastName
        ? student.lastName.toLowerCase().includes(filter.lastName.toLowerCase())
        : true;

      const matchEmail = filter.email
        ? student.email.toLowerCase().includes(filter.email.toLowerCase())
        : true;

      const matchDob = filter.dob
        ? student.dob === filter.dob
        : true;

      const matchSchool = filter.schoolName
        ? student.schoolName.toLowerCase().includes(filter.schoolName.toLowerCase())
        : true;

      const matchCoordinator = filter.schoolCoordinatorName
        ? student.schoolCoordinatorName.toLowerCase().includes(filter.schoolCoordinatorName.toLowerCase())
        : true;

      const matchTeacher = filter.schoolTeacherName
        ? student.schoolTeacherName.toLowerCase().includes(filter.schoolTeacherName.toLowerCase())
        : true;

      return (
        matchFirstName &&
        matchLastName &&
        matchEmail &&
        matchDob &&
        matchSchool &&
        matchCoordinator &&
        matchTeacher
      );
    })

  return (
    <div className="p-6 bg-base-100 rounded shadow space-y-4">
      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100 rounded">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th className="cursor-pointer select-none" onClick={handleSort}>
                First Name {sortDirection === 'asc' ? '↑' : '↓'}
              </th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>School Name</th>
              <th>Coordinator</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td>{(currentPageIndex - 1) * students.length + index + 1}</td>
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
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => loadPage(currentPageIndex - 1)}
            disabled={currentPageIndex <= 1}
          >
            « Prev
          </button>

          {pageTokens.map((_, idx) => (
            <button
              key={idx}
              className={`join-item btn btn-sm ${currentPageIndex === idx + 1 ? 'btn-active' : ''}`}
              onClick={() => loadPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          {hasMorePages && (
            <button
              className="join-item btn btn-sm"
              onClick={() => loadPage(currentPageIndex + 1)}
            >
              Next »
            </button>
          )}
        </div>
      </div>

      {loading && (
        <p className="text-center text-sm text-base-content/70">Loading students...</p>
      )}
    </div>
  );
};
