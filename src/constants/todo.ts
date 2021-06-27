import { colors } from '@material-ui/core';

// Types
import { TodoPriority, TodoPriorityOption } from '@/types/todo';

export const TodoPriorityOptions: TodoPriorityOption[] = [
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

export const TodoDueTimeFormats: string[] = [
  'ha',
  'hha',
  'hA',
  'HHA',
  'h a',
  'hh a',
  'h A',
  'HH A',
  'h:ma',
  'hh:ma',
  'hh:mma',
  'h:mA',
  'hh:mA',
  'hh:mmA',
  'h:m a',
  'hh:m a',
  'hh:mm a',
  'h:m A',
  'hh:m A',
  'hh:mm A',
];
