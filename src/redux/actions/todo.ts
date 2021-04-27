import { IAction, ITodo } from '@/typings';

export const setTodos = (todos: ITodo[]): IAction => ({
  type: 'SET_TODOS',
  payload: {
    todos,
  },
});

export const addTodo = (todo: ITodo): IAction => ({
  type: 'ADD_TODO',
  payload: {
    todo,
  },
});

export const updateTodo = (todo: ITodo): IAction => ({
  type: 'UPDATE_TODO',
  payload: {
    todo,
  },
});

export const deleteTodo = (todoId: string | any): IAction => ({
  type: 'DELETE_TODO',
  payload: {
    todoId,
  },
});

export const completeTodo = (todoId: string | any): IAction => ({
  type: 'COMPLETE_TODO',
  payload: {
    todoId,
  },
});
