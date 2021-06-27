import { FC, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import {
  IconButton,
  Avatar,
  Popover,
  MenuList,
  MenuItem,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

// API
import api from '@/api';

// Custom Hooks
import { useAuth } from '@/hooks';

const UserHeaderMenu: FC<{}> = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAuth().user!;
  const [menuButton, setMenuButton] = useState<HTMLElement | null>(null);

  const handleShowMenu = (e: MouseEvent<HTMLButtonElement>): void => {
    setMenuButton(e.currentTarget);
  };

  const handleHideMenu = (): void => {
    setMenuButton(null);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      const { data } = await api.post('/auth/signout');
      localStorage.clear();
      enqueueSnackbar(data.message, {
        variant: 'success',
      });
      await router.push('/signin');
    } catch (err) {}
  };

  return (
    <>
      <IconButton onClick={handleShowMenu} color={`inherit`}>
        {user.profileImageURL ? (
          <Avatar alt={user.email} src={user.profileImageURL} />
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
        <MenuList>
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};

export default UserHeaderMenu;
