import update from 'immutability-helper';

// Types
import { Action, ListReducer } from '@/types/redux';
import { List } from '@/types/list';

// Constants
import {
  SET_TOTAL_LISTS,
  SET_LISTS,
  ADD_LIST,
  UPDATE_LIST,
  DELETE_LIST,
} from '@/constants/redux/list';

const initialState: ListReducer = {
  total: 0,
  lists: [] as List[],
};

export default function listReducer(
  state = initialState,
  action: Action,
): ListReducer {
  switch (action.type) {
    case SET_TOTAL_LISTS:
      return update(state, {
        total: {
          $set: action.payload,
        },
      });

    case SET_LISTS:
      return update(state, {
        lists: {
          $set: action.payload,
        },
      });

    case ADD_LIST:
      return update(state, {
        lists: {
          $push: action.payload,
        },
      });

    case UPDATE_LIST:
      const updatedList: List = action.payload;
      const newLists: List[] = state.lists.map((list) => {
        if (list._id === updatedList._id) {
          return updatedList;
        }

        return list;
      });
      return update(state, {
        lists: {
          $set: newLists,
        },
      });

    case DELETE_LIST:
      return update(state, {
        lists: {
          $set: state.lists.filter((list) => list._id !== action.payload),
        },
      });

    default:
      return state;
  }
}
