import { ICurrentReducer, IAction } from '@/typings';

const initialState: ICurrentReducer = {
  selectedTodoCategory: 'today',
};

export default function currentReducer(
  state: ICurrentReducer = initialState,
  action: IAction,
) {
  switch (action.type) {
    case 'SET_CURRENT_SELECTED_TODO_CATEGORY':
      return {
        ...state,
        selectedTodoCategory: action.payload.selectedTodoCategory,
      };

    default:
      return state;
  }
}
