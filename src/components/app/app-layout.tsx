import React, { FC, ReactNode } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  colors,
  AppBar,
  Grid,
  Toolbar,
  Typography,
  CssBaseline,
  Avatar,
} from '@material-ui/core';
import {
  CalendarToday as CalendarTodayIcon,
  Inbox as InboxIcon,
  Event as EventIcon,
  Flag as FlagIcon,
} from '@material-ui/icons';
import clsx from 'clsx';

// Components
import { CustomHead } from '@/components';
import { UserHeaderMenu } from '@/components/user';
import { TodoSummaryCard } from '@/components/todo';

// Custom Hooks
import { useAuth } from '@/hooks';

type AppLayoutProps = {
  title: string;
  children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ title, children }) => {
  const classes = useStyles();
  const user = useAuth().user;

  return (
    user && (
      <>
        <CustomHead title={title} />

        <CssBaseline />

        <Grid container direction={`column`}>
          <Grid item>
            <AppBar position={`fixed`} variant={`outlined`}>
              <Toolbar variant={`dense`}>
                <Typography className={classes.headerTitle} variant={`h6`}>
                  Fancy Todo
                </Typography>

                <UserHeaderMenu />
              </Toolbar>
            </AppBar>
          </Grid>

          <Grid item>
            <Toolbar variant={`regular`} />
          </Grid>

          <Grid
            item
            container
            className={classes.summaryWrapper}
            direction={`row`}
            wrap={`nowrap`}
          >
            <Grid
              item
              container
              direction={`column`}
              justify={`space-evenly`}
              alignItems={`stretch`}
            >
              <Grid item>
                <TodoSummaryCard
                  title={`Today`}
                  total={100}
                  icon={
                    <Avatar className={clsx(classes.circle, classes.blue)}>
                      <CalendarTodayIcon fontSize={`small`} />
                    </Avatar>
                  }
                />
              </Grid>

              <Grid item>
                <TodoSummaryCard
                  title={`All`}
                  total={100}
                  icon={
                    <Avatar className={clsx(classes.circle, classes.grey)}>
                      <InboxIcon fontSize={`small`} />
                    </Avatar>
                  }
                />
              </Grid>
            </Grid>

            <Grid
              item
              container
              direction={`column`}
              justify={`space-evenly`}
              alignItems={`stretch`}
            >
              <Grid item>
                <TodoSummaryCard
                  title={`Scheduled`}
                  total={100}
                  icon={
                    <Avatar className={clsx(classes.circle, classes.red)}>
                      <EventIcon fontSize={`small`} />
                    </Avatar>
                  }
                />
              </Grid>

              <Grid item>
                <TodoSummaryCard
                  title={`Prioritized`}
                  total={100}
                  icon={
                    <Avatar className={clsx(classes.circle, classes.orange)}>
                      <FlagIcon fontSize={`small`} />
                    </Avatar>
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item className={classes.main}>
            {children}
          </Grid>
        </Grid>
      </>
    )
  );
};

export default AppLayout;

const useStyles = makeStyles((theme) =>
  createStyles({
    headerTitle: {
      flexGrow: 1,
      fontWeight: theme.typography.fontWeightBold,
    },
    blue: {
      backgroundColor: colors.blue[500],
      color: '#fff',
    },
    red: {
      backgroundColor: colors.red[500],
      color: '#fff',
    },
    grey: {
      backgroundColor: colors.grey[600],
      color: '#fff',
    },
    orange: {
      backgroundColor: colors.orange[500],
      color: '#fff',
    },
    summaryWrapper: {
      margin: theme.spacing(2, 0),
      '& > *': {
        margin: theme.spacing(0, 1),
        '& > *': {
          margin: theme.spacing(1, 0),
        },
      },
    },
    main: {
      padding: theme.spacing(0, 2),
    },
    circle: {
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
    },
  }),
);
