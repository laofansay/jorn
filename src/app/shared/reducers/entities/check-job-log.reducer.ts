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
  ICheckJobLog,
  defaultValue,
} from "@/app/shared/model/check-job-log.model";

const initialState: EntityState<ICheckJobLog> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

const apiUrl = "/api/check-job-logs";

// Actions

export const getEntities = createAsyncThunk(
  "checkJobLog/fetch_entity_list",
  async ({ query, page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}?${sort ? `page=${page}&size=${size}&sort=${sort}&${query}&` : `${query}`}cacheBuster=${new Date().getTime()}`;
    return axios.get<ICheckJobLog[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  "checkJobLog/fetch_entity",
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<ICheckJobLog>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  "checkJobLog/create_entity",
  async (entity: ICheckJobLog, thunkAPI) => {
    return axios.post<ICheckJobLog>(apiUrl, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  "checkJobLog/update_entity",
  async (entity: ICheckJobLog, thunkAPI) => {
    return axios.put<ICheckJobLog>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity),
    );
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  "checkJobLog/partial_update_entity",
  async (entity: ICheckJobLog, thunkAPI) => {
    return axios.patch<ICheckJobLog>(
      `${apiUrl}/${entity.id}`,
      cleanEntity(entity),
    );
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  "checkJobLog/delete_entity",
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    return await axios.delete<ICheckJobLog>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// slice

export const CheckJobLogSlice = createEntitySlice({
  name: "checkJobLog",
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

export const { reset } = CheckJobLogSlice.actions;

// Reducer
export default CheckJobLogSlice.reducer;
