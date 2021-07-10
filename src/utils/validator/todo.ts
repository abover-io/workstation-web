import moment from 'moment';

// Types
import { Validation } from '@/types';
import {
  Todo,
  TodoValidator as TodoValidatorInterface,
  TodoPriority,
} from '@/types/todo';

class TodoValidator implements TodoValidatorInterface {
  public Id(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'ID cannot be empty!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public ListId(input: string | null): Validation {
    if (input) {
      return {
        error: false,
        text: '',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public Name(input: string): Validation {
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

  public Notes(input: string | null): Validation {
    if (input) {
      return {
        error: false,
        text: '',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public URL(input: string | null): Validation {
    const pattern: RegExp = new RegExp(
      '^(https?:\\/\\/)?' + // Protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and Path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query String
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );

    if (input) {
      if (!pattern.test(input)) {
        return {
          error: true,
          text: 'Invalid URL!',
        };
      }
    }

    return {
      error: false,
      text: '',
    };
  }

  public Due(input: string): Validation {
    if (input) {
      if (!moment(input).isValid()) {
        return {
          error: true,
          text: 'Invalid due!',
        };
      } else {
        return {
          error: false,
          text: '',
        };
      }
    }

    return {
      error: true,
      text: 'Due cannot be empty!',
    };
  }

  public Priority(input: string): Validation {
    switch (input) {
      case TodoPriority.NONE:
        break;

      case TodoPriority.LOW:
        break;

      case TodoPriority.MEDIUM:
        break;

      case TodoPriority.HIGH:
        break;

      default:
        return {
          error: true,
          text: 'Invalid priority!',
        };
    }

    return {
      error: false,
      text: '',
    };
  }
}

export default new TodoValidator();
