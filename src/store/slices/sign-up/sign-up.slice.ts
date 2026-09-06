'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SignUpState = {
  step: number;
};

const initialState: SignUpState = {
  step: 1,
};

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setStepSignUp: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
  },
});

export const { setStepSignUp } = signUpSlice.actions;

export const signUpReducer = signUpSlice.reducer;

export const signUpSelectors = {
  selectSignUp: (state: { signUp: SignUpState }) => state.signUp,
};
