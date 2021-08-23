import { FC, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Avatar,
  Popover,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Settings as SettingsIcon,
  ExitToApp as SignOutIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';

// API
import api from '@/api';

// Custom Hooks
import { useAuth } from '@/hooks';

// Redux Actions
import { setUser } from '@/redux/actions/auth';

const UserHeaderMenu: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuth().user!;
  const [menuButton, setMenuButton] = useState<HTMLElement | null>(null);

  const handleShowMenu = (e: MouseEvent<HTMLButtonElement>): void => {
    if (menuButton) {
      return setMenuButton(null);
    }

    return setMenuButton(e.currentTarget);
  };

  const handleHideMenu = (): void => {
    setMenuButton(null);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      const { data } = await api.post('/auth/signout');
      localStorage.clear();
      dispatch(setUser(null));
      enqueueSnackbar(data.message, {
        variant: 'success',
      });
      await router.push('/signin');
    } catch (err) {}
  };

  return (
    <>
      <IconButton onClick={handleShowMenu} color={`inherit`}>
        {user?.profileImageURL ? (
          <Avatar
            alt={user.email}
            src={user.profileImageURL}
            imgProps={{
              referrerPolicy: 'no-referrer',
            }}
          />
        ) : (
          <Avatar>
            {user.name
              .split(' ')
              .map((n) => n[0].toUpperCase())
              .join('')}
          </Avatar>
        )}
      </IconButton>

      <Popover
        anchorEl={menuButton}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(menuButton)}
        onClose={handleHideMenu}
      >
        <MenuList
          disablePadding
          subheader={
            <MenuItem button={false}>
              <ListItemIcon className={classes.profileIcon}>
                {user.profileImageURL ? (
                  <Avatar
                    alt={user.email}
                    src={user.profileImageURL}
                    imgProps={{
                      referrerPolicy: 'no-referrer',
                    }}
                  />
                ) : (
                  <Avatar>
                    {user.name
                      .split(' ')
                      .map((n) => n[0].toUpperCase())
                      .join('')}
                  </Avatar>
                )}
              </ListItemIcon>
              <ListItemText primary={user.name} secondary={user.email} />
            </MenuItem>
          }
        >
          <MenuItem onClick={() => router.push('/app/settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <SignOutIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Sign out' />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};

export default UserHeaderMenu;

const useStyles = makeStyles((theme) =>
  createStyles({
    profileIcon: {
      marginRight: theme.spacing(2),
    },
  }),
);
