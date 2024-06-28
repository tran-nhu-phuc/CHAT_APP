import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';

const loginSlice = createSlice({
  name: 'dataLogin',
  initialState: {
    data: null,
  },
  reducers: {
    setDataLogin: (state, action) => {
      state.data = action.payload;
    },
  },
});

export default loginSlice.reducer;
export const { setDataLogin } = loginSlice.actions;
export const selectDataLogin = (state: AppState) => state.dataLoginSlice.data;
