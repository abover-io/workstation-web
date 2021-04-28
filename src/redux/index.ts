import { Reducer, CombinedState, combineReducers, createStore } from 'redux';

// Types
import { IRootState, IAction } from '@/types/redux';

// Reducers
import { authReducer, listReducer } from './reducers';

const reducers: Reducer<CombinedState<IRootState>, IAction> = combineReducers<
  IRootState,
  IAction
>({
  auth: authReducer,
  list: listReducer,
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
