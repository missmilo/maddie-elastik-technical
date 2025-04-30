import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Student {
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

interface StudentState {
  filter: string;
}

const initialState: StudentState = {
  filter: '',
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const { setFilter } = studentSlice.actions;
export default studentSlice.reducer;
