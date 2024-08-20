import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UploadState {
    progress: number;
    status: 'idle' | 'uploading' | 'succeeded' | 'failed';
  }
  
  const initialState: UploadState = {
    progress: 0,
    status: 'idle',
  };
  
  const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
      startUpload(state) {
        state.status = 'uploading';
      },
      setProgress(state, action: PayloadAction<number>) {
        state.progress = action.payload;
      },
      completeUpload(state) {
        state.status = 'succeeded';
        state.progress = 100;
      },
      failUpload(state) {
        state.status = 'failed';
        state.progress = 0;
      },
    },
  });
  
  export const { startUpload, setProgress, completeUpload, failUpload } = uploadSlice.actions;
  export default uploadSlice.reducer;