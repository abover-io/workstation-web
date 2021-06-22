import { useSelector } from 'react-redux';

// Types
import { RootState, TodoReducer } from '@/types/redux';

export default function useTodo(): TodoReducer {
  return useSelector((state: RootState) => state.todo);
}
