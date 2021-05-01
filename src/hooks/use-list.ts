import { useSelector } from 'react-redux';

// Types
import { IRootState, IListReducer } from '@/types/redux';

export default function useList(): IListReducer {
  return useSelector((state: IRootState) => state.list);
}
