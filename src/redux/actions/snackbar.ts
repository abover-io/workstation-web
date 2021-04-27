import { IAction } from '@/typings';

export const setInfo = (info: string): IAction => ({
  type: 'SET_INFO',
  payload: {
    info,
  },
});

export const setWarning = (warning: string): IAction => ({
  type: 'SET_WARNING',
  payload: {
    warning,
  },
});

export const setError = (errorMessage: string, errorName?: string): IAction => {
  let error = errorMessage;

  if (errorName) {
    error = `${errorName}: ${error}`;
  }
  
  return {
    type: 'SET_ERROR',
    payload: {
      error,
    },
  };
};

export const setSuccess = (success: string): IAction => ({
  type: 'SET_SUCCESS',
  payload: {
    success,
  },
});

export const resetSnackbar = (): IAction => ({
  type: 'RESET_SNACKBAR',
});
