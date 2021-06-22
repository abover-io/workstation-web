// Types
import { Action } from '@/types/redux';
import { Todo } from '@/types/todo';

// Constants
import {
  SET_TOTAL_TODOS,
  SET_TODOS,
  ADD_TODO,
  UPDATE_TODO,
  DELETE_TODO,
} from '@/constants/redux/todo';

export function setTotalTodos(total: number): Action<number> {
  return {
    type: SET_TOTAL_TODOS,
    payload: total,
  };
}

export function setTodos(todos: Todo[]): Action<Todo[]> {
  return {
    type: SET_TODOS,
    payload: todos,
  };
}

export function addTodo(todo: Todo): Action<Todo> {
  return {
    type: ADD_TODO,
    payload: todo,
  };
}

export function updateTodo(todo: Todo): Action<Todo> {
  return {
    type: UPDATE_TODO,
    payload: todo,
  };
}

export function deleteTodo(todoId: string): Action<string> {
  return {
    type: DELETE_TODO,
    payload: todoId,
  };
}
