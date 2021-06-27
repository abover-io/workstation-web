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
  Button,
  ButtonProps,
  Grid,
} from '@material-ui/core';
import { EditOutlined } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

// Types
import { Todo } from '@/types/todo';

// API
import api from '@/api';

// Constants
import { TodoPriorityOptions } from '@/constants/todo';

// Redux Actions
import { addTodo, updateTodo, deleteTodo } from '@/redux/actions/todo';

// Components
import UpdateTodoForm, { UpdateTodoFormProps } from './update-todo-form';
import TodoPriorityPicker, {
  TodoPriorityPickerProps,
} from './todo-priority-picker';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowActions(true);
  };
  const handleMouseLeave = () => {
    setShowActions(false);
  };

  const handleOpenUpdateForm = () => {
    setOpenUpdate(true);
  };
  const handleCloseUpdateForm = () => {
    setOpenUpdate(false);
  };

  const handleUncompleteTodo: ButtonProps['onClick'] = async () => {
    try {
      setLoading(true);

      const { data } = await api.patch(`/todos/uncomplete/${todo._id}`);

      dispatch(addTodo(data.todo));

      setLoading(false);

      enqueueSnackbar(data.message, {
        variant: 'success',
        persist: false,
      });
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

  const handleCompleteTodo: CheckboxProps['onChange'] = async (e) => {
    try {
      if (e.target.checked) {
        setLoading(true);

        const { data } = await api.patch(`/todos/complete/${todo._id}`);

        setLoading(false);

        enqueueSnackbar(data.message, {
          variant: 'success',
          persist: false,
          action: () => (
            <Button
              variant={`text`}
              color={`inherit`}
              onClick={handleUncompleteTodo}
            >
              {`Undo`}
            </Button>
          ),
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

  const handleFinishUpdate: UpdateTodoFormProps['onFinish'] = (todo) => {
    dispatch(updateTodo(todo));
  };
  const handleFinishUpdatePriority: TodoPriorityPickerProps['onFinishUpdatePriority'] =
    (todo) => {
      dispatch(updateTodo(todo));
    };

  const priority = TodoPriorityOptions.filter(
    (p) => p.value === todo.priority,
  )[0];

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ListItem disableGutters divider disabled={loading}>
        {!openUpdate && (
          <>
            <ListItemIcon>
              <Checkbox
                color={`primary`}
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
                <TodoPriorityPicker
                  todo={todo}
                  onFinishUpdatePriority={handleFinishUpdatePriority}
                />

                <IconButton
                  edge={`end`}
                  aria-label={`update-todo`}
                  onClick={handleOpenUpdateForm}
                >
                  <EditOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </>
        )}

        <UpdateTodoForm
          todo={todo}
          open={openUpdate}
          onClose={handleCloseUpdateForm}
          onFinish={handleFinishUpdate}
        />
      </ListItem>
    </div>
  );
};

export default TodoItem;
