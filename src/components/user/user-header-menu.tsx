import React, { useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Avatar,
  Popover,
  MenuList,
  MenuItem,
} from '@material-ui/core';

import { IUser, IRootState } from '@/typings';
import { userAPI } from '@/utils';
import { setError, setSuccess } from '@/redux/actions/snackbar';

export interface IUserHeaderMenuProps {}

export default function UserHeaderMenu({}: IUserHeaderMenuProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const user: IUser = useSelector(
    (state: IRootState) => state.user.currentUser,
  );
  const [menuButton, setMenuButton] = useState<HTMLElement | null>(null);

  const handleShowMenu = (e: MouseEvent<HTMLButtonElement>): void => {
    setMenuButton(e.currentTarget);
  };

  const handleHideMenu = (): void => {
    setMenuButton(null);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      const { data } = await userAPI.post('/signout');
      localStorage.clear();
      dispatch(setSuccess(data.message));
      await router.push('/signin');
    } catch (err) {
      if (err.response) {
        if (err.response.data) {
          dispatch(setError(err.response.data.message, err.response.data.name));
        } else {
          dispatch(setError('Unknown error has occured!'));
        }
      }
    }
  };

  return (
    <div className={classes.menuWrapper}>
      <IconButton onClick={handleShowMenu} color={`inherit`}>
        {user.profileImageURL && user.profileImageURL.length > 0 ? (
          <Avatar alt={user.username} src={user.profileImageURL} />
        ) : (
          <Avatar>
            {user.lastName && user.lastName.length > 0
              ? `${user.firstName[0].concat(user.lastName[0]).toUpperCase()}`
              : user.firstName && user.firstName.length > 0
              ? user.firstName[0].toUpperCase()
              : ''}
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
        <MenuList>
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    menuWrapper: {},
  }),
);
