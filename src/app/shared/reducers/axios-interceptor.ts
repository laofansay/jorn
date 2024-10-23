import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Storage } from 'react-jhipster';

const TIMEOUT = 60 * 1000; // 1 minute in milliseconds
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

// Set default configurations for axios
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = BASE_URL;

const setupAxiosInterceptors = (onUnauthenticated: () => void) => {
  // Add token to headers for each request
  const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    const token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  // Handle response success
  const onResponseSuccess = (response: AxiosResponse): AxiosResponse => response;

  // Handle response errors
  const onResponseError = (error: AxiosError): Promise<AxiosError> => {
    const status = error.status || (error.response ? error.response.status : 0);
    if (status === 403 || status === 401) {
      onUnauthenticated();
    }
    return Promise.reject(error);
  };

  // Register interceptors
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
