import React, { useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  CssBaseline,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Inbox as InboxIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
} from '@material-ui/icons';
import clsx from 'clsx';

// Utils
import { capitalize } from '@/utils';

// Components
import { CustomHead } from '@/components';
import { UserHeaderMenu } from '@/components/user';

// Custom Hooks
import { useAuth } from '@/hooks';

export interface IAppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: IAppLayoutProps) {
  const classes = useStyles();
  const theme = useTheme();
  const user = useAuth().user;
  const [openMenu, setOpenMenu] = useState<boolean>(true);

  return (
    user && (
      <>
        <CustomHead title={capitalize('adam')} />
        <section className={classes.appLayoutWrapper}>
          <CssBaseline />
          <AppBar
            position={`fixed`}
            className={clsx(classes.appBar, {
              [classes.appBarShift]: openMenu,
            })}
          >
            <Toolbar>
              <IconButton
                edge={`start`}
                className={clsx(classes.menuButton, openMenu && classes.hide)}
                color={`inherit`}
                aria-label={`Menu`}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant={`h6`} className={classes.headerTitle}>
                Fancy Todo
              </Typography>
              <UserHeaderMenu />
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant={`persistent`}
            anchor={`left`}
            open={openMenu}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              {['Inbox', 'Today', 'Upcoming'].map((category) => (
                <ListItem button key={category.toLowerCase()}>
                  <ListItemIcon>
                    {category.toLowerCase() === 'inbox' ? (
                      <InboxIcon />
                    ) : category.toLowerCase() === 'today' ? (
                      <TodayIcon />
                    ) : category.toLowerCase() === 'upcoming' ? (
                      <DateRangeIcon />
                    ) : (
                      ''
                    )}
                  </ListItemIcon>
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <main
            className={clsx(classes.content, {
              [classes.contentShift]: openMenu,
            })}
          >
            <div className={classes.drawerHeader} />
            {children}
          </main>
        </section>
      </>
    )
  );
}

const drawerWidth: number = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appLayoutWrapper: {
      flexGrow: 1,
      display: 'flex',
    },
    menuButton: {
      marginRight: theme.spacing(3),
    },
    headerTitle: {
      flexGrow: 1,
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(5),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);
