import { useSelector } from 'react-redux';

// Types
import { IRootState, IAuthReducer } from '@/types/redux';

export default function useAuth(): IAuthReducer {
  return useSelector((state: IRootState) => state.auth);
}
