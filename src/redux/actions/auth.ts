// Types
import { IAction } from '@/types/redux';
import { IUser } from '@/types/auth';

export function setUser(user: IUser): IAction<IUser> {
  return {
    type: 'SET_USER',
    payload: user,
  };
}
