import { Moment } from 'moment';

// Types
import { Validation } from './';

export interface Todo {
  _id: string;
  listId: string;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  completed: boolean;
  priority: string;
}

export interface TodoFormValidations {
  name: Validation;
  notes: Validation;
  url: Validation;
  due: Validation;
}

export interface TodoFormData {
  listId: string;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  completed: boolean;
  priority: string;
}
