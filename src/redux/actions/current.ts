import { IAction } from '@/typings';

export const setSelectedTodoCategory = (selectedTodoCategory: string): IAction => ({
  type: 'SET_CURRENT_SELECTED_TODO_CATEGORY',
  payload: {
    selectedTodoCategory
  }
});
