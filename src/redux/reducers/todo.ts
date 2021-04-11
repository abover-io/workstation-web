import { ITodoReducer, IAction, ITodo } from '@/typings';

const initialState: ITodoReducer = {
  todos: [] as ITodo[],
};

export default function todoReducer(
  state = initialState,
  action: IAction,
): ITodoReducer {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: [...action.payload.todos] };

    case 'ADD_TODO':
      return {
        ...state,
        todos: state.todos.concat(action.payload.todo),
      };

    case 'UPDATE_TODO':
      const copiedTodosFromUpdate = [...state.todos];
      const updatedTodoIdx = copiedTodosFromUpdate.findIndex(
        (todo) => todo._id === action.payload.todo._id,
      );
      copiedTodosFromUpdate[updatedTodoIdx] = action.payload.todo;

      return {
        ...state,
        todos: copiedTodosFromUpdate,
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: [...state.todos].filter(
          (todo) => todo._id !== action.payload.todoId,
        ),
      };

    case 'COMPLETE_TODO':
      const todosAfterComplete = [...state.todos].filter(
        (todo) => todo._id !== action.payload.todoId,
      );
      return {
        ...state,
        todos: todosAfterComplete,
      };

    default:
      return state;
  }
}
