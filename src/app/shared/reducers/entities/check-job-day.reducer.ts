import axios from "axios";
import { createAsyncThunk, isFulfilled, isPending } from "@reduxjs/toolkit";
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from "react-jhipster";
import { cleanEntity } from "@/app/shared/util/entity-utils";
import {
  IQueryParams,
  createEntitySlice,
  EntityState,
  serializeAxiosError,
} from "@/app/shared/reducers/reducer.utils";
import {
  ICheckJobDay,
  defaultValue,
} from "@/app/shared/model/check-job-day.model";

const initialState: EntityState<ICheckJobDay> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = "/api/check-job-days";

// Actions

export const getEntities = createAsyncThunk(
  "checkJobDay/fetch_entity_list",
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ""}cacheBuster=${new Date().getTime()}`;
    return axios.get<ICheckJobDay[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  "checkJobDay/fetch_entity",
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<ICheckJobDay>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  "checkJobDay/create_entity",
  async (entity: ICheckJobDay, thunkAPI) => {
    console.info(entity);
    return axios.post<ICheckJobDay>(apiUrl, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  "checkJobDay/update_entity",
  async (entity: ICheckJobDay, thunkAPI) => {
    return axios.put<ICheckJobDay>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity),
    );
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  "checkJobDay/partial_update_entity",
  async (entity: ICheckJobDay, thunkAPI) => {
    return axios.patch<ICheckJobDay>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity),
    );
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  "checkJobDay/delete_entity",
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    return await axios.delete<ICheckJobDay>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const downloadEntity = createAsyncThunk(
  "checkJobDay/download_entity",
  async (
    { id, day }: { id: string | number; day: string | number },
    thunkAPI,
  ) => {
    const response = await axios.get(`/api/check-job-days/down/${id}/${day}`, {
      responseType: "blob", // Important for downloading files
    });
    return response.data; // This will be the file blob
  },
  { serializeError: serializeAxiosError },
);

export const doExecute = createAsyncThunk(
  "checkJobDay/doExecute",
  async ({ jobId, day }: { jobId: number; day: string }, thunkAPI) => {
    return axios.post<ICheckJobDay>(
      `/api/check-job-days/execute/${jobId}/${day}`,
    );
  },
  { serializeError: serializeAxiosError },
);

// slice

export const CheckJobDaySlice = createEntitySlice({
  name: "checkJobDay",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, (state) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addCase(doExecute.fulfilled, (state) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data, headers } = action.payload;
        const links = parseHeaderForLinks(headers.link);
        return {
          ...state,
          loading: false,
          links,
          entities: loadMoreDataWhenScrolled(state.entities, data, links),
          totalItems: parseInt(headers["x-total-count"], 10),
        };
      })
      .addMatcher(
        isFulfilled(createEntity, updateEntity, partialUpdateEntity),
        (state, action) => {
          state.updating = false;
          state.loading = false;
          state.updateSuccess = true;
          state.entity = action.payload.data;
        },
      )
      .addMatcher(isPending(getEntities, getEntity), (state) => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(
        isPending(
          createEntity,
          updateEntity,
          partialUpdateEntity,
          deleteEntity,
          doExecute,
        ),
        (state) => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.updating = true;
        },
      )

      .addMatcher(isPending(downloadEntity), (state) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(downloadEntity), (state, action) => {
        state.loading = false; // Reset loading state after download
        const blob = action.payload; // Assuming this is a Blob
        console.error("err");
        state.links = window.URL.createObjectURL(blob);
        console.error(state.links);
      });
  },
});

export const { reset } = CheckJobDaySlice.actions;

// Reducer
export default CheckJobDaySlice.reducer;
