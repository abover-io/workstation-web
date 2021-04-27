import moment, { Moment } from 'moment';

import { IValidator } from '@/typings';

export default class Validator implements IValidator {
  public static Name(input: string): string | null {
    if (!input) {
      return 'Name cannot be empty!';
    }

    return null;
  }

  public static username(input: string): string | null {
    if (!input) {
      return 'Username cannot be empty!';
    } else if (!(input && input.length >= 6)) {
      return 'Username must be at least 6 characters!';
    } else if (input && /.+@.+\..+/.test(input)) {
      return 'Username cannot be an email format!';
    }

    return null;
  }

  public static email(input: string): string | null {
    if (!input) {
      return 'Email cannot be empty!';
    } else if (input && !/.+@.+\..+/.test(input)) {
      return 'Invalid email address!';
    }

    return null;
  }

  public static userIdentifier(input: string): string | null {
    if (!input) {
      return 'Username or email is required!';
    } else if (
      !input.includes('@') &&
      !(input && !/.+@.+\..+/.test(input) && input.length >= 6)
    ) {
      return 'Username must be at least 6 characters!';
    } else if (input.includes('@') && !(input && /.+@.+\..+/.test(input))) {
      return 'Invalid email address!';
    }

    return null;
  }

  public static password(input: string): string | null {
    if (!input) {
      return 'Password is required!';
    } else if (input.length < 6) {
      return 'Password must be at least 6 characters!';
    }

    // if (
    //   input.length >= 6 &&
    //   !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*)(+=._-`])([a-zA-Z0-9!@#$%^&*)(+=._-`]+)$/g.test(
    //     input,
    //   )
    // ) {
    //   return 'Password must contain at least a Number, a Special Character, and an Upper-Case Letter!';
    // }

    return null;
  }

  public static todoName(input: string): string | null {
    if (!input) {
      return 'Todo Name cannot be empty!';
    }

    return null;
  }

  public static dueTime(input: string | null): string | null {
    const defaultErrMessage: string = 'Invalid time!';

    if (!input) {
      return null;
    } else if (input !== null) {
      if (
        input.split(' ').length > 1 &&
        input.indexOf(' ') !== 0 &&
        input.split(' ').includes(':')
      ) {
        let momentTime: Moment | string = moment(input, 'hh:mm A');
        momentTime = momentTime.format('hh:mm A');

        console.log({
          momentTime,
          split: input.split(' '),
        });

        if (input[0] === '0') {
          momentTime = momentTime.slice(1);
        }

        if (input !== momentTime) {
          return defaultErrMessage;
        }

        return null;
      } else if (
        input.split(' ').length > 1 &&
        !input.split(' ').includes(':')
      ) {
        const inputArr: Array<string> = input.split(' ');
        const time: number = +inputArr[0];
        const format: string = inputArr[1];

        if (isNaN(time)) {
          return defaultErrMessage;
        } else if (format && !format.match(/\b(am|pm)\b/i)) {
          return defaultErrMessage;
        } else if (time > 12 || time < 0) {
          return defaultErrMessage;
        }

        return null;
      }

      const separatorRegExp: RegExp = /[a-z]+|[^a-z]+/gi;
      const inputArr: RegExpMatchArray | null = input!.match(separatorRegExp);
      const time: number | null = +inputArr![0];
      const format: string | null = inputArr![1];

      if (isNaN(time)) {
        return defaultErrMessage;
      } else if (inputArr!.length > 2) {
        return defaultErrMessage;
      } else if (!format) {
        return defaultErrMessage;
      } else if (format && !format.match(/\b(am|pm)\b/i)) {
        return defaultErrMessage;
      } else if (time > 12 || time < 0) {
        return defaultErrMessage;
      }
    }

    return null;
  }
}
