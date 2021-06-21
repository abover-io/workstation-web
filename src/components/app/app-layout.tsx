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
  Drawer,
  Menu,
  IconButton,
} from '@material-ui/core';
import {
  MenuOutlined,
  CalendarTodayOutlined,
  InboxOutlined,
  EventOutlined,
  FlagOutlined,
} from '@material-ui/icons';
import clsx from 'clsx';

// Styles
import { GlobalStyles } from '@/styles';

// Components
import { CustomHead } from '@/components';
import { UserHeaderMenu } from '@/components/user';
import { TodoSummaryCard } from '@/components/todo';

// Custom Hooks
import { useAuth } from '@/hooks';

interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ title, children }) => {
  const classes = useStyles();
  const { user } = useAuth();

  return (
    <>
      <CustomHead title={title} />
      <GlobalStyles />
      {user && (
        <>
          <CssBaseline />

          <Grid container direction={`column`}>
            <Grid item>
              <AppBar position={`fixed`}>
                <Toolbar>
                  <IconButton edge={`start`}>
                    <MenuOutlined />
                  </IconButton>

                  <Typography className={classes.headerTitle} variant={`h6`}>
                    Fancy Todo
                  </Typography>

                  <UserHeaderMenu />
                </Toolbar>
              </AppBar>
            </Grid>

            <Grid item>
              <Toolbar />
            </Grid>

            <Grid item className={classes.main}>
              {children}
            </Grid>
          </Grid>
        </>
      )}
    </>
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
      padding: theme.spacing(4),
    },
    circle: {
      width: theme.spacing(4.5),
      height: theme.spacing(4.5),
    },
  }),
);
