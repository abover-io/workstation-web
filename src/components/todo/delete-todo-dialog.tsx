import { FC, useState } from 'react';
import {
  colors,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

// API
import api from '@/api';

// Types
import { Todo } from '@/types/todo';

export interface DeleteTodoDialogProps {
  todo: Todo;
  open: boolean;
  onCancel: () => Promise<void> | void;
  onFinish: (todo: Todo) => Promise<void> | void;
}

const DeleteTodoDialog: FC<DeleteTodoDialogProps> = ({
  todo,
  open,
  onCancel,
  onFinish,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteTodo = async () => {
    try {
      setLoading(true);

      const { data } = await api.delete(`/todos/${todo._id}`);

      enqueueSnackbar(data.message, {
        variant: 'success',
        persist: false,
      });

      setLoading(false);

      onFinish(data.todo);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <Typography>Are you sure you want to delete {todo.name}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant='text'
          disabled={loading}
          color='primary'
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          disabled={loading}
          onClick={handleDeleteTodo}
          style={{ background: colors.red[500], color: colors.common.white }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTodoDialog;
