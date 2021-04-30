import moment, { Moment } from 'moment';

import { Validation } from '@/types';

export default class UserValidator {
  public static Name(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Name cannot be empty!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public static Email(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Email cannot be empty!',
      };
    } else if (input && !/.+@.+\..+/.test(input)) {
      return {
        error: true,
        text: 'Invalid email address!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public static Password(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Password is required!',
      };
    } else if (input.length < 6) {
      return {
        error: true,
        text: 'Password must be at least 6 characters!',
      };
    }

    // if (
    //   input.length >= 6 &&
    //   !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*)(+=._-`])([a-zA-Z0-9!@#$%^&*)(+=._-`]+)$/g.test(
    //     input,
    //   )
    // ) {
    //   return {
    //     error: true,
    //     text:
    //       'Password must contain at least a Number, a Special Character, and an Upper-Case Letter!',
    //   };
    // }

    return {
      error: false,
      text: '',
    };
  }
}
