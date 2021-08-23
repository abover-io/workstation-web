import { FC } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Toolbar,
  // IconButton,
  Typography,
  Button,
} from '@material-ui/core';

// Custom Hooks
import { useAuth } from '@/hooks';

const Header: FC<{}> = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    router.push({
      pathname: `/signup`,
    });
  };
  const handleGoToApp = () => {
    router.push({
      pathname: `/app`,
    });
  };

  return (
    <AppBar position={`fixed`}>
      <Toolbar>
        <Typography
          variant={`h6`}
          style={{ flexGrow: 1 }}
        >{`Fancy Todo`}</Typography>

        {user ? (
          <Button variant={`text`} color={`inherit`} onClick={handleGoToApp}>
            {`Go to app`}
          </Button>
        ) : (
          <Button
            variant={`outlined`}
            color={`inherit`}
            onClick={handleGetStarted}
          >{`Get started`}</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
