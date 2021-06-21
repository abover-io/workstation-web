import { FC, useState, FormEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';

// API
import api from '@/api';

// Types
import { Todo } from '@/types/todo';

interface AddTodoFormProps {
  onFinish: (todo: Todo) => void;
}

const AddTodoForm: FC<AddTodoFormProps> = ({ onFinish }) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTodo = async (e: FormEvent) => {
    try {
      e.preventDefault();
      onFinish({} as Todo);
    } catch (err) {}
  };

  return (
    <>
      {!open && (
        <Button
          className={classes.button}
          variant={`text`}
          startIcon={<AddOutlined />}
          onClick={handleOpen}
        >{`Add Todo`}</Button>
      )}

      {open && (
        <Grid
          className={classes.wrapper}
          container
          component={`form`}
          onSubmit={handleAddTodo}
          direction={`column`}
          spacing={1}
        >
          <Grid item>
            <TextField fullWidth variant={`outlined`} multiline />
          </Grid>

          <Grid item container justify={`flex-end`} spacing={1}>
            <Grid item>
              <Button variant={`text`} onClick={handleClose}>{`Cancel`}</Button>
            </Grid>

            <Grid item>
              <Button variant={`contained`} color={`primary`}>{`Add`}</Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AddTodoForm;

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      width: '100%',
    },
    button: {
      width: '100%',
    },
  }),
);
