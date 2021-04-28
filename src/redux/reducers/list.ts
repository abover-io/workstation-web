import update from 'immutability-helper';

// Types
import { IAction, IListReducer } from '@/types/redux';
import { IList } from '@/types/list';

const initialState: IListReducer = {
  list: [] as IList[],
};

export default function listReducer(
  state = initialState,
  action: IAction,
): IListReducer {
  switch (action.type) {
    case 'SET_LISTS':
      return update(state, {
        list: {
          $set: action.payload,
        },
      });

    case 'ADD_LIST':
      return update(state, {
        list: {
          $push: action.payload,
        },
      });

    case 'UPDATE_LIST':
      const updatedList: IList = action.payload;
      const newLists: IList[] = state.list.map((list) => {
        if (list._id === updatedList._id) {
          return updatedList;
        }

        return list;
      });
      return update(state, {
        list: {
          $set: newLists,
        },
      });

    case 'DELETE_LIST':
      return update(state, {
        list: {
          $set: state.list.filter((list) => list._id !== action.payload),
        },
      });

    default:
      return state;
  }
}
