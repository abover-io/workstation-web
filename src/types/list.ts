// Types
import { Validation } from './';

export interface IList {
  _id: string;
  email: string;
  name: string;
  color: string;
}

export interface IListFormValidations {
  name: Validation;
  color: Validation;
}

export interface IListFormData {
  name: string;
  color: string;
}
