import React, { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ButtonBase, Grid, Paper, Typography } from '@material-ui/core';

type TodoSummaryCardProps = {
  title: string;
  total: number;
  icon: any;
};

const TodoSummaryCard: FC<TodoSummaryCardProps> = ({ title, total, icon }) => {
  const classes = useStyles();

  return (
    <Paper variant={`outlined`}>
      <ButtonBase className={classes.buttonBase}>
        <Grid
          container
          direction={`row`}
          wrap={`nowrap`}
          justify={`space-between`}
          alignItems={`stretch`}
        >
          <Grid
            item
            container
            direction={`column`}
            justify={`space-between`}
            alignItems={`flex-start`}
            spacing={1}
          >
            <Grid item>{icon}</Grid>

            <Grid item>
              <Typography className={classes.title} variant={`body1`}>
                {title}
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Typography className={classes.total} variant={`h5`}>
              {total}
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Paper>
  );
};

export default TodoSummaryCard;

const useStyles = makeStyles((theme) =>
  createStyles({
    buttonBase: {
      padding: theme.spacing(1.2),
      width: '100%',
    },
    title: {
      color: theme.palette.grey[600],
      fontWeight: theme.typography.fontWeightBold,
    },
    total: {
      color: theme.palette.grey[900],
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);
