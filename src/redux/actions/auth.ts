// Types
import { Action } from '@/types/redux';
import { User } from '@/types/auth';

// Constants
import { SET_USER } from '@/constants/redux/auth';

export function setUser(user: User | null): Action<User | null> {
  return {
    type: SET_USER,
    payload: user,
  };
}
