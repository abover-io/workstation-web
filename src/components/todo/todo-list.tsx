import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography, Divider } from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment, { Moment } from 'moment';

import TodoCard from './todo-card';
import BlankTodoCard from './blank-todo-card';

// Typings
import { ITodo } from '@/typings';

// Utils
import { capitalize } from '@/utils';

export interface ITodoListProps {
  todos: ITodo[];
  category: 'today' | 'upcoming' | string;
  currentDate?: Moment | MaterialUiPickersDate;
  addTodoCard?: boolean;
}

export default function TodoList({
  todos,
  category,
  currentDate = moment(),
  addTodoCard = true,
}: ITodoListProps) {
  const classes = useStyles();

  const renderHeader = (): JSX.Element => {
    switch (category.toLowerCase()) {
      case 'inbox':
        return (
          <Grid item classes={{ root: classes.todoListHeader }}>
            <Typography variant={`h4`} gutterBottom>
              {capitalize(category)}
            </Typography>

            <Divider />
          </Grid>
        );

      case 'today':
        return (
          <Grid item classes={{ root: classes.todoListHeader }}>
            <Typography variant={`h4`} gutterBottom>
              {capitalize(category)}

              <Typography color={`textSecondary`}>
                {moment().format('dddd, MMMM Do YYYY')}
              </Typography>
            </Typography>

            <Divider />
          </Grid>
        );

      case 'upcoming':
        return (
          <Grid item classes={{ root: classes.todoListHeader }}>
            <Typography variant={`h4`} gutterBottom>
              {capitalize(category)}

              <Typography color={`textSecondary`}>
                {currentDate!.format('dddd, MMMM Do YYYY')}
              </Typography>
            </Typography>

            <Divider />
          </Grid>
        );

      default:
        return (
          <Grid item classes={{ root: classes.todoListHeader }}>
            <Typography variant={`h4`} gutterBottom>
              {capitalize(category)}
            </Typography>

            <Divider />
          </Grid>
        );
    }
  };

  return (
    <Grid
      classes={{ root: classes.todoListWrapper }}
      container
      direction={`column`}
      wrap={`nowrap`}
      justify={`center`}
      alignItems={`stretch`}
    >
      {renderHeader()}

      <Grid
        item
        container
        spacing={5}
        wrap={`wrap`}
        justify={`flex-start`}
        alignItems={`center`}
      >
        {todos
          .filter((todo) => todo.completed === false)
          .map((todo) => (
            <Grid item key={todo._id}>
              <TodoCard todo={todo} mode={`show`} />
            </Grid>
          ))}

        {addTodoCard ? (
          <Grid item>
            <BlankTodoCard currentDate={currentDate} />
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    todoListWrapper: {
      // paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(6),
    },
    todoListHeader: {
      paddingBottom: theme.spacing(2),
    },
  }),
);
