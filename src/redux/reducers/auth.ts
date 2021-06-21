import update from 'immutability-helper';

// Types
import { Action, AuthReducer } from '@/types/redux';

const initialState: AuthReducer = {
  user: null,
};

export default function authReducer(
  state = initialState,
  action: Action,
): AuthReducer {
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
