// Types
import { IAction } from '@/types/redux';
import { IList } from '@/types/list';

export function setLists(lists: IList[]): IAction<IList[]> {
  return {
    type: 'SET_LISTS',
    payload: lists,
  };
}

export function addList(list: IList): IAction<IList> {
  return {
    type: 'ADD_LIST',
    payload: list,
  };
}

export function updateList(list: IList): IAction<IList> {
  return {
    type: 'UPDATE_LIST',
    payload: list,
  };
}

export function deleteList(listId: string): IAction<string> {
  return {
    type: 'DELETE_LIST',
    payload: listId,
  };
}
