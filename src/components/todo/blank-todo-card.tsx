import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  ButtonBase,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment, { Moment } from 'moment';

import TodoCard from './todo-card';

export interface IBlankTodoCardProps {
  currentDate?: Moment | MaterialUiPickersDate;
}

export default function BlankTodoCard({
  currentDate = moment(),
}: IBlankTodoCardProps) {
  const classes = useStyles();
  const [showAddTodoCard, setShowAddTodoCard] = useState<boolean>(false);

  const handleShowAddTodoCard = (): void => {
    setShowAddTodoCard(true);
  };

  const handleCancelAddTodo = (): void => {
    setShowAddTodoCard(false);
  };

  const handleCompleteAddTodo = (): void => {
    setShowAddTodoCard(false);
  };

  return (
    <>
      {showAddTodoCard ? (
        <TodoCard
          mode={`add`}
          defaultDate={currentDate}
          onCancel={handleCancelAddTodo}
          onComplete={handleCompleteAddTodo}
        />
      ) : (
        <ButtonBase onClick={handleShowAddTodoCard}>
          <Card classes={{ root: classes.blankCard }} elevation={0}>
            <CardContent classes={{ root: classes.blankCardContent }}>
              <AddIcon classes={{ root: classes.addIcon }} />
              <Typography
                classes={{ root: classes.addTypography }}
                variant={`h6`}
                align={`center`}
              >
                Add Todo
              </Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      )}
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    blankCard: {
      width: 250,
      height: 250,
      display: 'flex',
      borderColor: grey[500],
      borderWidth: 5,
      padding: theme.spacing(1),
      borderStyle: 'dashed',
      cursor: 'pointer',
      '&:hover': {},
    },
    blankCardContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(1),
      '&:last-child': {
        paddingBottom: theme.spacing(1),
      },
    },
    addIcon: {
      color: grey[500],
      width: 100,
      height: 100,
    },
    addTypography: {
      color: grey[500],
    },
  }),
);
