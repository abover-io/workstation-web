import React, { useState, MouseEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Flag as FlagIcon } from '@material-ui/icons';
import { red, orange, blue } from '@material-ui/core/colors';
import clsx from 'clsx';

// Typings
import { ITodo } from '@/typings';

export interface ITodoPriorityPicker {
  todo: ITodo;
  onTodoPriorityChange: (priority: number) => void | Promise<void>;
}

export default function TodoPriorityPicker({
  todo,
  onTodoPriorityChange,
}: ITodoPriorityPicker) {
  const classes = useStyles();
  const [
    todoPriorityButton,
    setTodoPriorityButton,
  ] = useState<HTMLElement | null>(null);

  const handleShowTodoPriorityPicker = (
    e: MouseEvent<HTMLButtonElement>,
  ): void => {
    setTodoPriorityButton(e.currentTarget);
  };

  const handleHideTodoPriorityPicker = (): void => {
    setTodoPriorityButton(null);
  };

  const handleTodoPriorityChange = (priority: number): void => {
    onTodoPriorityChange(priority);
    handleHideTodoPriorityPicker();
  };

  return (
    <div className={classes.todoPriorityPickerWrapper}>
      <Tooltip arrow title={`Priority ${todo.priority}`}>
        <IconButton
          className={clsx({
            [classes.priority1]: todo.priority === 1,
            [classes.priority2]: todo.priority === 2,
            [classes.priority3]: todo.priority === 3,
          })}
          size={`small`}
          onClick={handleShowTodoPriorityPicker}
        >
          <FlagIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={todoPriorityButton}
        open={Boolean(todoPriorityButton)}
        onClose={handleHideTodoPriorityPicker}
        keepMounted
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {[1, 2, 3, 4].map((priorityNumber) => (
          <MenuItem
            key={priorityNumber}
            dense
            onClick={() => handleTodoPriorityChange(priorityNumber)}
          >
            <ListItemIcon
              className={clsx({
                [classes.priority1]: priorityNumber === 1,
                [classes.priority2]: priorityNumber === 2,
                [classes.priority3]: priorityNumber === 3,
              })}
            >
              <FlagIcon />
            </ListItemIcon>

            <ListItemText primary={`Priority ${priorityNumber}`} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    todoPriorityPickerWrapper: {},
    priority1: {
      color: red[500],
    },
    priority2: {
      color: orange[500],
    },
    priority3: {
      color: blue[500],
    },
  }),
);
