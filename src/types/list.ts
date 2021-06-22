// Types
import { Validation } from './';

export interface List {
  _id: string;
  email: string;
  name: string;
  color: string;
}

export interface ListFormValidations {
  name: Validation;
  color: Validation;
}

export interface ListFormData {
  name: string;
  color: string;
}
