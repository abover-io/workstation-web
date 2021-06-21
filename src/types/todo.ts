import { Moment } from 'moment';
import { colors } from '@material-ui/core';

// Types
import { Validation, Option } from './';

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

export enum TodoPriority {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TodoPriorityOption extends Option {
  color?: string;
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
