// Types
import { IAction } from '@/types/redux';
import { IUser } from '@/types/auth';

export function setUser(user: IUser | null): IAction<IUser | null> {
  return {
    type: 'SET_USER',
    payload: user,
  };
}
