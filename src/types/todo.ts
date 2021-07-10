import { ReactNode } from 'react';
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
  due: Moment;
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
  Due: (input: string) => Validation;
  Priority: (input: string) => Validation;
}

export interface AddTodoFormValidation {
  listId: Validation;
  name: Validation;
  notes: Validation;
  url: Validation;
  due: Validation;
  priority: Validation;
}

export interface UpdateTodoFormValidation {
  listId: Validation;
  name: Validation;
  notes: Validation;
  url: Validation;
  due: Validation;
  priority: Validation;
}

export interface AddTodoFormData {
  list: List | null;
  name: string;
  notes: string | null;
  url: string | null;
  due: Moment;
  priority: TodoPriorityOption;
}

export interface UpdateTodoFormData {
  list: List | null;
  name: string;
  notes: string | null;
  url: string | null;
  due: Moment;
  priority: TodoPriorityOption;
}
