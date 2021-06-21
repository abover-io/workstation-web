import { colors } from '@material-ui/core';

// Types
import { TodoPriority, TodoPriorityOption } from '@/types/todo';

export const TodoPriorities: TodoPriorityOption[] = [
  {
    label: 'None',
    value: TodoPriority.NONE,
  },
  {
    label: 'Low',
    value: TodoPriority.LOW,
    color: colors.blue[500],
  },
  {
    label: 'Medium',
    value: TodoPriority.MEDIUM,
    color: colors.orange[500],
  },
  {
    label: 'High',
    value: TodoPriority.HIGH,
    color: colors.red[500],
  },
];
