import { Moment } from 'moment';

/**
 *
 * Model Interfaces
 *
 */

export interface ITodo {
  _id?: string | any;
  name: string;
  due: string | Date | Moment | null;
  isTimeSet: boolean;
  dueDate: string | null;
  dueTime: string | null;
  priority: number;
  position: number | null;
  completed: boolean;
}

export interface IUser {
  firstName: string;
  lastName: string;
  isUsernameSet: boolean;
  username: string;
  email: string;
  isPasswordSet: boolean;
  verified: boolean;
  profileImageURL: string;
}

export interface ISignInData {
  userIdentifier: string;
  password: string;
}

export interface ISignUpData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 *
 * Validatoion Interfaces
 *
 */

export interface ISignInValidations {
  userIdentifier: string | null;
  password: string | null;
  [key: string]: string | null;
}

export interface ISignUpValidations {
  firstName: string | null;
  email: string | null;
  username: string | null;
  password: string | null;
  confirmPassword: string | null;
  [key: string]: string | null;
}

export interface ITodoValidations {
  name: string | null;
  dueTime: string | null;
}

/**
 *
 * Redux State Interfaces
 *
 */

export interface IRootState {
  user: IUserReducer;
  todo: ITodoReducer;
  demo: IDemoReducer;
  current: ICurrentReducer;
  snackbar: ISnackbarReducer;
}

export interface IAction {
  type: string;
  payload?: any;
}

export interface IUserReducer {
  currentUser: IUser;
}

export interface ITodoReducer {
  todos: ITodo[];
}

export interface IDemoReducer {
  todos: ITodo[];
}

export interface ICurrentReducer {
  selectedTodoCategory: string;
}

export interface ISnackbarReducer {
  info: string | null;
  warning: string | null;
  error: string | null;
  success: string | null;
}

/**
 *
 * Material UI Component Option Interfaces
 *
 */

export interface ISnackbarOptions {
  severity?: 'error' | 'warning' | 'info' | 'success';
  message: string | null;
  open: boolean;
}

/**
 *
 * API Interfaces
 *
 */

export interface IValidationFromAPI {
  name: string;
  message: string;
}

/**
 *
 * Utils Interfaces
 *
 */

export interface IValidator {
  [method: string]: any;
}
