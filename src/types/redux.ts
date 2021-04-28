import { IUser } from './auth';
import { IList } from './list';

export interface IAction<T = any> {
  type: string;
  payload: T;
}

export interface IRootState {
  auth: IAuthReducer;
  list: IListReducer;
}

export interface IAuthReducer {
  user: IUser | null;
}

export interface IListReducer {
  list: IList[];
}
