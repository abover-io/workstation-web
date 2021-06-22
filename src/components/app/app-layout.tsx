import React, { FC, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Grid,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import {
  MenuOutlined,
  CloseOutlined,
  CalendarTodayOutlined,
  EventNoteOutlined,
  FiberManualRecord as FiberManualRecordIcon,
  KeyboardArrowRightOutlined,
  KeyboardArrowDownOutlined,
} from '@material-ui/icons';

// Styles
import { GlobalStyles } from '@/styles';

// Components
import { CustomHead } from '@/components';
import { UserHeaderMenu } from '@/components/user';

// Custom Hooks
import { useAuth, useList } from '@/hooks';

interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ title, children }) => {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useAuth();
  const { lists } = useList();
  const [open, setOpen] = useState<boolean>(false);
  const [openLists, setOpenLists] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleLists = () => {
    setOpenLists(!openLists);
  };

  return (
    <>
      <CustomHead title={title} />
      <GlobalStyles />
      {user && (
        <>
          <Grid container direction={`column`}>
            <Grid item>
              <AppBar className={classes.appBar} position={`fixed`}>
                <Toolbar>
                  {open ? (
                    <IconButton
                      edge={`start`}
                      color={`inherit`}
                      onClick={handleClose}
                    >
                      <CloseOutlined />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge={`start`}
                      color={`inherit`}
                      onClick={handleOpen}
                    >
                      <MenuOutlined />
                    </IconButton>
                  )}

                  <Typography className={classes.headerTitle} variant={`h6`}>
                    {`Fancy Todo`}
                  </Typography>

                  <UserHeaderMenu />
                </Toolbar>
              </AppBar>

              <Drawer
                anchor={`left`}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  className: classes.drawerPaper,
                }}
              >
                <Toolbar />

                <div className={classes.drawerContent}>
                  {/* Default */}
                  <List>
                    <ListItem button onClick={() => router.push('/app/today')}>
                      <ListItemIcon>
                        <CalendarTodayOutlined />
                      </ListItemIcon>
                      <ListItemText primary={`Today`} />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => router.push('/app/scheduled')}
                    >
                      <ListItemIcon>
                        <EventNoteOutlined />
                      </ListItemIcon>
                      <ListItemText primary={`Scheduled`} />
                    </ListItem>
                  </List>

                  {/* Custom */}
                  <List>
                    {/* Lists */}
                    <ListItem button onClick={handleToggleLists}>
                      <ListItemIcon>
                        {openLists ? (
                          <KeyboardArrowDownOutlined />
                        ) : (
                          <KeyboardArrowRightOutlined />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={`Lists`} />
                    </ListItem>

                    <Collapse in={openLists} timeout={`auto`} unmountOnExit>
                      <List disablePadding>
                        {lists.map((list) => (
                          <ListItem
                            key={list._id}
                            button
                            onClick={() =>
                              router.push(`/app/lists/${list._id}`)
                            }
                          >
                            <ListItemIcon style={{ color: list.color }}>
                              <FiberManualRecordIcon color={`inherit`} />
                            </ListItemIcon>
                            <ListItemText primary={list.name} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </List>
                </div>
              </Drawer>
            </Grid>

            <Grid item>
              <Toolbar />
            </Grid>

            <Grid className={classes.main} item component={`main`}>
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
    appBar: {
      zIndex: theme.zIndex.drawer + 101,
    },
    headerTitle: {
      flexGrow: 1,
      fontWeight: theme.typography.fontWeightBold,
    },
    drawerPaper: {
      width: '80%',
    },
    drawerContent: {
      padding: theme.spacing(1, 0),
    },
    main: {
      padding: theme.spacing(4),
    },
  }),
);
