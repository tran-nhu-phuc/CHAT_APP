import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';

const updateListRoomSlice = createSlice({
  name: 'update-list-room',
  initialState: { status: false },
  reducers: {
    updateListRoom: (state) => {
      state.status = !state.status;
    },
  },
});

export default updateListRoomSlice.reducer;
export const { updateListRoom } = updateListRoomSlice.actions;
export const selectUpdateListRoom = (state: AppState) => state.updateListRoom.status;
