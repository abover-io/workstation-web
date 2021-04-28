import update from 'immutability-helper';

// Types
import { IAction, IAuthReducer } from '@/types/redux';

const initialState: IAuthReducer = {
  user: null,
};

export default function authReducer(
  state = initialState,
  action: IAction,
): IAuthReducer {
  switch (action.type) {
    case 'SET_USER':
      return update(state, {
        user: {
          $set: action.payload,
        },
      });

    default:
      return state;
  }
}
