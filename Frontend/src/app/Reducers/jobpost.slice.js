import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobPostName: '',
  jobPostDescription: '',
  jobPostAddress: '',
  jobPostSkill: [],
  jobPostCompany: '',
  jobPostType: 'fulltime',
  jobPostMinSalary: 0,
  jobPostMaxSalary: 0,
  jobPostMode: 'onsite',
  jobPostLevel: 'entry-level',
  jobPostQualification: 'none',
  jobPostVacancies: 1,
};

const jobPostSlice = createSlice({
  name: 'jobPost',
  initialState,
  reducers: {
    setJobPost: (state, action) => {
      Object.assign(state, action.payload); // Merges payload into state
    },
    addSkill: (state, action) => {
      const skill = action.payload.trim();
      if (skill && !state.jobPostSkill.includes(skill)) {
        state.jobPostSkill.push(skill); // Directly mutate state
      }
    },
    removeSkill: (state, action) => {
      const skillToRemove = action.payload;
      state.jobPostSkill = state.jobPostSkill.filter(skill => skill !== skillToRemove); // Directly mutate state
    },
    resetJobPost: () => {
      return initialState; // Reset to initial state
    },
  },
});

export const { setJobPost, addSkill, removeSkill, resetJobPost } = jobPostSlice.actions;

export default jobPostSlice.reducer;
