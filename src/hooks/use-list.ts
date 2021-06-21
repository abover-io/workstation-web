import { useSelector } from 'react-redux';

// Types
import { RootState, ListReducer } from '@/types/redux';

export default function useList(): ListReducer {
  return useSelector((state: RootState) => state.list);
}
