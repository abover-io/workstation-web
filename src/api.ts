import axios, { AxiosError } from 'axios';

// Redux
import reduxStore from '@/redux';

// Redux Actions
import { setUser } from '@/redux/actions/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response) {
      if (err.response.status === 401 || err.response.status === 403) {
        await api.post('/auth/signout');
        localStorage.clear();
        reduxStore.dispatch(setUser(null));
        window.location.reload();
      }
    }

    return Promise.reject(err);
  },
);

export default api;
