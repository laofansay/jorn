import axios from "axios";
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
} from "@reduxjs/toolkit";

import { EntityState } from "@/app/shared/reducers/reducer.utils";

import { serializeAxiosError } from "@/app/shared/reducers/reducer.utils";
import {
  IGoogleFile,
  defaultValue,
} from "@/app/shared/model/google-file.model";

const initialState: EntityState<IGoogleFile> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = "api/drive";

// Upload file to specified folder
export const uploadFile = createAsyncThunk(
  "googleFile/upload_file",
  async ({ file, folderId }: { file: File; folderId: string }, thunkAPI) => {
    const requestUrl = `${apiUrl}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);

    return axios.post<IGoogleFile>(requestUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  { serializeError: serializeAxiosError },
);

// Upload PDF to specified folder
export const uploadPdfFile = createAsyncThunk(
  "googleFile/upload_pdf_file",
  async ({ file, folderId }: { file: File; folderId: string }, thunkAPI) => {
    const requestUrl = `${apiUrl}/upload2`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);
    return axios.post<IGoogleFile>(requestUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  { serializeError: serializeAxiosError },
);

// Download file by fileId
export const downloadFile = createAsyncThunk(
  "googleFile/download_file",
  async (
    { fileId, fileName }: { fileId: string; fileName: string },
    thunkAPI,
  ) => {
    const requestUrl = `${apiUrl}/download/${fileId}?fileName=${fileName}`;
    return axios.get(requestUrl, { responseType: "blob" });
  },
  { serializeError: serializeAxiosError },
);

// List files in a folder
export const listFilesInFolder = createAsyncThunk(
  "googleFile/list_files",
  async (folderId: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/listFiles/${folderId}`;
    return axios.get<IGoogleFile[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// List subfolders in a folder
export const listSubFolders = createAsyncThunk(
  "googleFile/list_sub_folders",
  async (folderId: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/listFolder/${folderId}`;
    return axios.get<IGoogleFile[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// List root folders
export const listRootFolders = createAsyncThunk(
  "googleFile/list_root_folders",
  async (_, thunkAPI) => {
    const requestUrl = `${apiUrl}/listRootFolders`;
    return axios.get<IGoogleFile[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// Slice
const googleFileSlice = createSlice({
  name: "googleFile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.loading = false;
        // Handle download success if needed
        state.entity.push(action.payload);
      })
      .addMatcher(
        isFulfilled(listRootFolders, listSubFolders, uploadPdfFile, uploadFile),
        (state, action) => {
          state.updating = false;
          state.loading = false;
          state.updateSuccess = true;
          state.entitys = action.payload.data;
        },
      )
      .addMatcher(
        isPending(
          listRootFolders,
          listSubFolders,
          listFilesInFolder,
          uploadFile,
          uploadPdfFile,
          downloadFile,
        ),
        (state) => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.loading = true;
        },
      );
  },
});

// Export the reducer
export default googleFileSlice.reducer;
