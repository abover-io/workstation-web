import { Reducer, CombinedState, combineReducers, createStore } from 'redux';

// Types
import { RootState, Action } from '@/types/redux';

// Reducers
import { authReducer, listReducer, todoReducer } from './reducers';

const reducers: Reducer<CombinedState<RootState>, Action> = combineReducers<
  RootState,
  Action
>({
  auth: authReducer,
  list: listReducer,
  todo: todoReducer,
});

const store = createStore(reducers, enableReduxDevTools());

function enableReduxDevTools() {
  if (process.env.NODE_ENV !== 'production' && (process as any).browser) {
    return (
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
}

export default store;
