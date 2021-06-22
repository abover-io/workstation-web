// Types
import { Action } from '@/types/redux';
import { List } from '@/types/list';

// Constants
import {
  SET_TOTAL_LISTS,
  SET_LISTS,
  ADD_LIST,
  UPDATE_LIST,
  DELETE_LIST,
} from '@/constants/redux/list';

export function setTotalLists(total: number): Action<number> {
  return {
    type: SET_TOTAL_LISTS,
    payload: total,
  };
}

export function setLists(lists: List[]): Action<List[]> {
  return {
    type: SET_LISTS,
    payload: lists,
  };
}

export function addList(list: List): Action<List> {
  return {
    type: ADD_LIST,
    payload: list,
  };
}

export function updateList(list: List): Action<List> {
  return {
    type: UPDATE_LIST,
    payload: list,
  };
}

export function deleteList(listId: string): Action<string> {
  return {
    type: DELETE_LIST,
    payload: listId,
  };
}
