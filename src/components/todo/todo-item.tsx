import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  CheckboxProps,
  IconButton,
} from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

// Types
import { Todo } from '@/types/todo';

// API
import api from '@/api';

// Redux Actions
import { deleteTodo } from '@/redux/actions/todo';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowActions(true);
  };
  const handleMouseLeave = () => {
    setShowActions(false);
  };

  const handleCompleteTodo: CheckboxProps['onChange'] = async (e) => {
    try {
      if (e.target.checked) {
        setLoading(true);

        const { data } = await api.patch(`/todos/complete/${todo._id}`);

        setLoading(false);

        enqueueSnackbar(data.message, {
          variant: 'success',
          persist: false,
        });

        dispatch(deleteTodo(todo._id));
      }
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

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ListItem disableGutters divider disabled={loading}>
        <ListItemIcon>
          <Checkbox
            edge={`start`}
            checked={todo.completed}
            tabIndex={-1}
            inputProps={{ 'aria-labelledby': todo._id }}
            onChange={handleCompleteTodo}
          />
        </ListItemIcon>

        <ListItemText id={todo._id} primary={todo.name} />

        {showActions && (
          <ListItemSecondaryAction>
            <IconButton edge={`end`} aria-label={`update-todo`}>
              <EditOutlined />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </div>
  );
};

export default TodoItem;
