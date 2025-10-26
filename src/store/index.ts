import { configureStore } from '@reduxjs/toolkit';
import { authSlice, usersSlice } from './slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    users: usersSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
