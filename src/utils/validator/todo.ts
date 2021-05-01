// Types
import { Validation } from '@/types';

export default class TodoValidator {
  public static Name(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Todo name cannot be empty!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }
}
