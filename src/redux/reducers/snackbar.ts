import { ISnackbarReducer, IAction } from '@/typings';

const initialState: ISnackbarReducer = {
  info: null,
  warning: null,
  error: null,
  success: null,
};

export default function snackbarReducer(
  state: ISnackbarReducer = initialState,
  action: IAction,
) {
  switch (action.type) {
    case 'SET_INFO':
      return {
        ...state,
        info: action.payload.info,
      };

    case 'SET_WARNING':
      return {
        ...state,
        warning: action.payload.warning,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };

    case 'SET_SUCCESS':
      return {
        ...state,
        success: action.payload.success,
      };

    case 'RESET_SNACKBAR':
      return {
        info: null,
        warning: null,
        error: null,
        success: null,
      };

    default:
      return state;
  }
}
