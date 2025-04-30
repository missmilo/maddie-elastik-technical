import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StudentFilter {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  schoolName: string;
  schoolCoordinatorName: string;
  schoolTeacherName: string;
}

interface StudentState {
  filter: StudentFilter;
}

const initialState: StudentState = {
  filter: {
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    schoolName: '',
    schoolCoordinatorName: '',
    schoolTeacherName: '',
  },
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<StudentFilter>) => {
      state.filter = action.payload;
    },
  },
});

export const { setFilter } = studentSlice.actions;
export default studentSlice.reducer;
