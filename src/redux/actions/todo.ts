// Types
import { Action } from '@/types/redux';
import { Todo } from '@/types/todo';

// Constants
import {
  // Todo
  SET_TOTAL_TODOS,
  SET_TODOS,
  ADD_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  // Overdue
  SET_TOTAL_OVERDUES,
  SET_OVERDUES,
  ADD_OVERDUE,
  UPDATE_OVERDUE,
  DELETE_OVERDUE,
} from '@/constants/redux/todo';

// Todo

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

// Overdue

export function setTotalOverdues(total: number): Action<number> {
  return {
    type: SET_TOTAL_OVERDUES,
    payload: total,
  };
}

export function setOverdues(overdues: Todo[]): Action<Todo[]> {
  return {
    type: SET_OVERDUES,
    payload: overdues,
  };
}

export function addOverdue(overdue: Todo): Action<Todo> {
  return {
    type: ADD_OVERDUE,
    payload: overdue,
  };
}

export function updateOverdue(overdue: Todo): Action<Todo> {
  return {
    type: UPDATE_OVERDUE,
    payload: overdue,
  };
}

export function deleteOverdue(todoId: string): Action<string> {
  return {
    type: DELETE_OVERDUE,
    payload: todoId,
  };
}
