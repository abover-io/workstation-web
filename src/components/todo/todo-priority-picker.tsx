import { FC, useState } from 'react';
import {
  Tooltip,
  IconButton,
  IconButtonProps,
  Popover,
  PopoverProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Flag as FlagIcon } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import update from 'immutability-helper';

// Types
import { Todo, TodoPriorityOption } from '@/types/todo';

// API
import api from '@/api';

// Constants
import { TodoPriorityOptions } from '@/constants/todo';

export interface TodoPriorityPickerProps {
  todo: Todo;
  onFinishUpdatePriority: (todo: Todo) => Promise<void> | void;
}

const TodoPriorityPicker: FC<TodoPriorityPickerProps> = ({
  todo,
  onFinishUpdatePriority,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen: IconButtonProps['onClick'] = (e) => {
    if (!anchorEl) {
      setAnchorEl(e.currentTarget);
      return;
    }

    setAnchorEl(null);
  };

  const handleClose: PopoverProps['onClose'] = () => {
    setAnchorEl(null);
  };

  const handleUpdatePriority = async (newPriority: TodoPriorityOption) => {
    try {
      setLoading(true);

      const { data } = await api.patch(`/todos/priority/${todo._id}`, {
        priority: newPriority.value,
      });

      enqueueSnackbar(data.message, {
        variant: 'success',
        persist: false,
      });

      setLoading(false);
      setAnchorEl(null);

      onFinishUpdatePriority(
        update(data.todo, {
          due: {
            $set: moment(data.todo.due),
          },
        }),
      );
    } catch (err) {
      setLoading(false);

      if (err.response) {
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
          persist: false,
        });
      }
    }
  };

  const priority = TodoPriorityOptions.filter(
    (p) => p.value === todo.priority,
  )[0];

  return (
    <>
      <Tooltip title={priority.label} aria-label={priority.label}>
        <IconButton
          disabled={loading}
          onClick={handleOpen}
          style={{
            color: priority.color,
          }}
        >
          <FlagIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List>
          {TodoPriorityOptions.map((priority) => (
            <ListItem
              key={priority.value}
              button
              onClick={() => handleUpdatePriority(priority)}
            >
              <ListItemIcon style={{ color: priority.color }}>
                <FlagIcon color={`inherit`} />
              </ListItemIcon>
              <ListItemText
                primary={priority.label}
                style={{ color: priority.color }}
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default TodoPriorityPicker;
