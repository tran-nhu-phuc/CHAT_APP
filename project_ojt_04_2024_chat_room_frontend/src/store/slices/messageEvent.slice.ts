import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageResponse } from '../../apis/messages/responses/message.response';

export interface MessageState {
  state: MessageResponse | null;
  status: boolean;
}

const initialState: MessageState = { state: null, status: false };

const messageSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    incrementChangeEvent(state, action: PayloadAction<MessageResponse | null>) {
      return {
        state: action.payload,
        status: !state.status,
      };
    },
  },
});

export const { incrementChangeEvent } = messageSlice.actions;
export default messageSlice.reducer;
