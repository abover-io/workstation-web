import { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { LinearProgress, Grid } from '@material-ui/core';
import { AssignmentTurnedIn as AssignmentTurnedInIcon } from '@material-ui/icons';

import Container from './container';

const Loading: FC<{}> = () => {
  const classes = useStyles();

  return (
    <Container>
      <Grid
        container
        justify={`center`}
        alignContent={`center`}
        direction={`column`}
      >
        <Grid item>
          <LinearProgress className={classes.loading} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Loading;

const useStyles = makeStyles((theme) =>
  createStyles({
    loading: {
      width: theme.spacing(30),
      [theme.breakpoints.between('sm', 'md')]: {
        width: theme.spacing(60),
      },
      [theme.breakpoints.between('md', 'lg')]: {
        width: theme.spacing(96),
      },
      [theme.breakpoints.between('lg', 'xl')]: {
        width: theme.spacing(128),
      },
      [theme.breakpoints.up('xl')]: {
        width: theme.spacing(192),
      },
    },
  }),
);
