import { Moment } from 'moment';

// Types
import { Validation } from './';

export interface ITodo {
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

export interface ITodoFormValidations {
  name: Validation;
  notes: Validation;
  url: Validation;
  due: Validation;
}

export interface ITodoFormData {
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
