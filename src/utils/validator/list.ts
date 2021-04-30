// Types
import { Validation } from '@/types';

export default class ListValidator {
  public static Name(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'List name cannot be empty!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }
}
