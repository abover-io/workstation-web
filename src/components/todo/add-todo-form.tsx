import { FC, useState, FormEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  FormControl,
  TextField,
  Select,
  SelectProps,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import { AddOutlined, FlagOutlined } from '@material-ui/icons';

// API
import api from '@/api';

// Types
import { Todo } from '@/types/todo';

// Constants
import { TodoPriorities } from '@/constants/todo';

const AddTodoForm: FC<{}> = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [priorityOpen, setPriorityOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenPriority = () => {
    setPriorityOpen(true);
  };

  const handleClosePriority = () => {
    setPriorityOpen(false);
  };

  const handleChangePriority: SelectProps['onChange'] = (e) => {
    console.log(e.target.value);
  };

  const handleAddTodo = async (e: FormEvent) => {
    try {
      e.preventDefault();
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

          <Grid item container justify={`space-evenly`}>
            <Grid item>
              <Select
                open={priorityOpen}
                onClose={handleClosePriority}
                onOpen={handleOpenPriority}
                defaultValue={TodoPriorities[0].value}
                onChange={handleChangePriority}
              >
                {TodoPriorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <ListItemIcon style={{ color: priority.color }}>
                      <FlagOutlined color={`inherit`} />
                    </ListItemIcon>
                    <Typography variant={`inherit`}>
                      {priority.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
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
