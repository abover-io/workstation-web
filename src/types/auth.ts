// Types
import { Validation } from './';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string | null;
  verified: boolean;
  profileImageURL: string | null;
}

export interface ISignInFormValidations {
  email: Validation;
  password: Validation;
}

export interface ISignInFormData {
  email: string;
  password: string;
}

export interface ISignUpFormValidations {
  name: Validation;
  email: Validation;
  password: Validation;
}

export interface ISignUpFormData {
  name: string;
  email: string;
  password: string;
}
