import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import manga from '../features/manga/mangaSlice';
import upload from '../features/upload/uploadSlice';
import { api } from './services/api';
import { listenerMiddleware } from '../middleware/auth';

export const store = configureStore({
  reducer: { 
    [api.reducerPath]: api.reducer,
    auth,
    manga,
    upload
  },
  middleware: (getDefaulteMiddleware) => 
    getDefaulteMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
