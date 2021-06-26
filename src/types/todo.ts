import { Moment } from 'moment';

// Types
import { Validation, Option } from '.';
import { List } from './list';

export interface Todo {
  _id: string;
  userId: string;
  listId: string | null;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  completed: boolean;
  priority: TodoPriority;
}

export enum TodoPriority {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TodoPriorityOption extends Option {
  color?: string;
}

export interface TodoValidator {
  Id: (input: string) => Validation;
  ListId: (input: string) => Validation;
  Name: (input: string) => Validation;
  Notes: (input: string | null) => Validation;
  URL: (input: string | null) => Validation;
  IsDateSet: (input: boolean) => Validation;
  IsTimeSet: (input: boolean) => Validation;
  Due: (input: string | null) => Validation;
  Priority: (input: string) => Validation;
}

export interface AddTodoFormValidation {
  listId: Validation;
  name: Validation;
  notes: Validation;
  url: Validation;
  isDateSet: Validation;
  isTimeSet: Validation;
  due: Validation;
  priority: Validation;
}

export interface UpdateTodoFormValidation {
  name: Validation;
  notes: Validation;
  url: Validation;
  due: Validation;
}

export interface AddTodoFormData {
  list: List | null;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  priority: TodoPriorityOption;
}

export interface UpdateTodoFormData {
  _id: string;
  listId: string | null;
  name: string;
  notes: string | null;
  url: string | null;
  isDateSet: boolean;
  isTimeSet: boolean;
  due: Date | Moment | string | null;
  priority: TodoPriority;
}
