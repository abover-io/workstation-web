import { FC, useState, CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
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
} from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
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
import TodoListPicker, { TodoListPickerProps } from './todo-list-picker';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const classes = useStyles();
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
          action: (
            <Button
              variant={`text`}
              color={`inherit`}
              onClick={handleUncompleteTodo}
            >
              Undo
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
  const handleFinishUpdateList: TodoListPickerProps['onFinishUpdateList'] = (
    todo,
  ) => {
    dispatch(updateTodo(todo));
  };

  const handleFinishDelete: UpdateTodoFormProps['onFinishDelete'] = (todo) => {
    dispatch(deleteTodo(todo._id));
  };

  const dueTime: string =
    todo.due.get('h') > 0
      ? `${todo.due.calendar()} at ${todo.due.format('h:mm a')}`
      : todo.due.calendar();

  const priority =
    TodoPriorityOptions.filter((p) => p.value === todo.priority)[0] ||
    TodoPriorityOptions[0];

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
                style={{
                  color: priority.color,
                }}
              />
            </ListItemIcon>

            <ListItemText
              id={todo._id}
              primary={todo.name}
              secondary={dueTime}
            />

            {showActions && (
              <ListItemSecondaryAction className={classes.actionWrapper}>
                <TodoListPicker
                  todo={todo}
                  onFinishUpdateList={handleFinishUpdateList}
                />

                <TodoPriorityPicker
                  todo={todo}
                  onFinishUpdatePriority={handleFinishUpdatePriority}
                />

                <IconButton
                  edge={`end`}
                  aria-label={`update-todo`}
                  onClick={handleOpenUpdateForm}
                >
                  <EditIcon />
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
          onFinishDelete={handleFinishDelete}
        />
      </ListItem>
    </div>
  );
};

export default TodoItem;

const useStyles = makeStyles((theme) =>
  createStyles({
    actionWrapper: {
      '& > .MuiIconButton-root': {
        padding: theme.spacing(0.5),
      } as CSSProperties,
    },
  }),
);
