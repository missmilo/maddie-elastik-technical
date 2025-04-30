'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { setFilter } from '@/store/slices/studentSlice';

export const SearchCard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    schoolName: '',
    schoolCoordinatorName: '',
    schoolTeacherName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter(filters));
  };

  const handleReset = () => {
    const cleared = {
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      schoolName: '',
      schoolCoordinatorName: '',
      schoolTeacherName: '',
    };
    setFilters(cleared);
    dispatch(setFilter(cleared));
  };

  return (
    <div className="card w-full h-full bg-base-200 shadow-sm text-base-content">
      <div className="card-body">
        <h2 className="text-xl font-semibold mb-2">Filter Students</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              name="firstName"
              type="text"
              className="input input-bordered bg-base-100 w-full"
              value={filters.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              name="lastName"
              type="text"
              className="input input-bordered bg-base-100 w-full"
              value={filters.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              name="email"
              type="email"
              className="input input-bordered bg-base-100 w-full"
              value={filters.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">School Name</span>
            </label>
            <input
              name="schoolName"
              type="text"
              className="input input-bordered bg-base-100 w-full"
              value={filters.schoolName}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Coordinator</span>
            </label>
            <input
              name="schoolCoordinatorName"
              type="text"
              className="input input-bordered bg-base-100 w-full"
              value={filters.schoolCoordinatorName}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Teacher</span>
            </label>
            <input
              name="schoolTeacherName"
              type="text"
              className="input input-bordered bg-base-100 w-full"
              value={filters.schoolTeacherName}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 flex gap-4 justify-end mt-4">
            <button type="button" onClick={handleReset} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
