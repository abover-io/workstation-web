// Types
import { Validation } from '@/types';

export default class SubtodoValidator {
  public static Name(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Subtodo name cannot be empty!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }
}
