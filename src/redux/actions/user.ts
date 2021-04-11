import { IAction, IUser } from '@/typings';

export const setUser = (user: IUser): IAction => ({
  type: 'SET_USER',
  payload: {
    user
  }
});
