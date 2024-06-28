import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationIntf } from '../../types/entities.type';

export interface NotificationState {
  state: NotificationIntf | null;
  status: boolean;
}

const initialState: NotificationState = { state: null, status: false };

const notificationSlice = createSlice({
  name: 'notificationEvent',
  initialState,
  reducers: {
    newNotificationEvent(state, action: PayloadAction<NotificationIntf | null>) {
      return {
        state: action.payload,
        status: !state.status,
      };
    },
  },
});

export const { newNotificationEvent } = notificationSlice.actions;
export default notificationSlice.reducer;
