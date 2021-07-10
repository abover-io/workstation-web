// Types
import { User } from './auth';
import { List } from './list';
import { Todo } from './todo';

export interface Action<T = any> {
  type: string;
  payload: T;
}

export interface RootState {
  auth: AuthReducer;
  list: ListReducer;
  todo: TodoReducer;
}

export interface AuthReducer {
  user: User | null;
}

export interface ListReducer {
  total: number;
  lists: List[];
}

export interface TodoReducer {
  total: number;
  todos: Todo[];
  overdue: {
    total: number;
    todos: Todo[];
  };
}
