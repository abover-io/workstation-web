// Types
import { Validation } from './';

export interface ISubtodo {
  _id: string;
  name: string;
  todoId: string;
}

export interface ISubtodoFormValidations {
  name: Validation;
}

export interface ISubtodoFormData {
  name: string;
}
