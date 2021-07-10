import update from 'immutability-helper';

// Types
import { Action, TodoReducer } from '@/types/redux';
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

const initialState: TodoReducer = {
  total: 0,
  todos: [] as Todo[],
  overdue: {
    total: 0,
    todos: [] as Todo[],
  },
};

export default function todoReducer(
  state = initialState,
  action: Action,
): TodoReducer {
  switch (action.type) {
    // Todo

    case SET_TOTAL_TODOS:
      return update(state, {
        total: {
          $set: action.payload,
        },
      });

    case SET_TODOS:
      return update(state, {
        todos: {
          $set: action.payload,
        },
      });

    case ADD_TODO:
      return update(state, {
        total: {
          $set: state.total + 1,
        },
        todos: {
          $push: [action.payload],
        },
      });

    case UPDATE_TODO:
      const updatedTodo: Todo = action.payload;
      const newTodos: Todo[] = state.todos.map((todo) => {
        if (todo._id === updatedTodo._id) {
          return updatedTodo;
        }

        return todo;
      });
      return update(state, {
        todos: {
          $set: newTodos,
        },
      });

    case DELETE_TODO:
      return update(state, {
        todos: {
          $set: state.todos.filter((todo) => todo._id !== action.payload),
        },
      });

    // Overdue

    case SET_TOTAL_OVERDUES:
      return update(state, {
        overdue: {
          total: {
            $set: action.payload,
          },
        },
      });

    case SET_OVERDUES:
      return update(state, {
        overdue: {
          todos: {
            $set: action.payload,
          },
        },
      });

    case ADD_OVERDUE:
      return update(state, {
        overdue: {
          total: {
            $set: state.overdue.total + 1,
          },
          todos: {
            $push: [action.payload],
          },
        },
      });

    case UPDATE_OVERDUE:
      const updatedOverdue: Todo = action.payload;
      const newOverdues: Todo[] = state.overdue.todos.map((overdue) => {
        if (overdue._id === updatedOverdue._id) {
          return updatedOverdue;
        }

        return overdue;
      });
      return update(state, {
        overdue: {
          todos: {
            $set: newOverdues,
          },
        },
      });

    case DELETE_OVERDUE:
      return update(state, {
        overdue: {
          todos: {
            $set: state.overdue.todos.filter(
              (overdue) => overdue._id !== action.payload,
            ),
          },
        },
      });

    default:
      return state;
  }
}
