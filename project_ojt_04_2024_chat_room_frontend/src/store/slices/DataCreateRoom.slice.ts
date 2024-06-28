import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';
import { IDataCreateRoom } from '../../types/dataCreateRoom.type';

const dataCreateRoomSlice = createSlice({
  name: 'data-create-room',
  initialState: { data: [] as IDataCreateRoom[] },
  reducers: {
    setDataCreateRoom: (state, action) => {
      state.data.push({ ...action.payload, id: Date.now() });
    },
    removeDataCreateRoom: (state, action) => {
      const data = state.data.filter((item: IDataCreateRoom) => item.id !== action.payload);
      state.data = [...data];
    },
    switchDataCreateRoom: (state, action) => {
      state.data = [...action.payload];
    },
    dataEditRoom: (state, action) => {
      state.data = [{ ...action.payload }];
    },
    resetDataCreateRoom: (state) => {
      state.data = [];
    },
  },
});

export default dataCreateRoomSlice.reducer;
export const { setDataCreateRoom, removeDataCreateRoom, switchDataCreateRoom, dataEditRoom, resetDataCreateRoom } =
  dataCreateRoomSlice.actions;
export const selectCreateRoomData = (state: AppState) => state.dataCreateRoom.data;
