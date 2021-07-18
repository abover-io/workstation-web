import moment from 'moment';

// Types
import { Todo } from '@/types/todo';

export default function convertToMoment(todo: Todo): Todo {
  todo.due = moment(todo.due);
  return todo;
}
