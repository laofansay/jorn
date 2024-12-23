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
import { ICheckJob, defaultValue } from "@/app/shared/model/check-job.model";

const initialState: EntityState<ICheckJob> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = "/api/check-jobs";

// Actions

export const getEntities = createAsyncThunk(
  "checkJob/fetch_entity_list",
  async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&` : ""}cacheBuster=${new Date().getTime()}`;
    return axios.get<ICheckJob[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  "checkJob/fetch_entity",
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<ICheckJob>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  "checkJob/create_entity",
  async (entity: ICheckJob, thunkAPI) => {
    return axios.post<ICheckJob>(apiUrl, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  "checkJob/update_entity",
  async (entity: ICheckJob, thunkAPI) => {
    return axios.put<ICheckJob>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  "checkJob/partial_update_entity",
  async (entity: ICheckJob, thunkAPI) => {
    return axios.patch<ICheckJob>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity),
    );
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  "checkJob/delete_entity",
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    return await axios.delete<ICheckJob>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// slice

export const CheckJobSlice = createEntitySlice({
  name: "checkJob",
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
        ),
        (state) => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.updating = true;
        },
      );
  },
});

export const { reset } = CheckJobSlice.actions;

// Reducer
export default CheckJobSlice.reducer;
