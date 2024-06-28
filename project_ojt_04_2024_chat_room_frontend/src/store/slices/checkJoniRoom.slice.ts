import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';

const checkJoinOutRoom = createSlice({
  name: 'check-join-out-room',
  initialState: { status: false },
  reducers: {
    check: (state) => {
      state.status = !state.status;
    },
  },
});

export default checkJoinOutRoom.reducer;
export const { check } = checkJoinOutRoom.actions;
export const selectCheckJointOutRoom = (state: AppState) => state.checkJoinOutRoom.status;
