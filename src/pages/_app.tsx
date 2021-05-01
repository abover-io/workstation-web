import 'fontsource-roboto';

import React, { useEffect, useCallback } from 'react';
import NextApp, {
  AppProps as NextAppProps,
  AppContext as NextAppContext,
} from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import cookie from 'cookie';
import { SnackbarProvider } from 'notistack';

// Types
import { CookieMessage } from '@/types';

// Components
import { Loading } from '@/components';

// Redux
import reduxStore from '@/redux';
import { setUser } from '@/redux/actions/auth';

// Styles
import '@/styles/global.scss';
import { muiTheme } from '@/styles';

// APIs
import { AuthAPI } from '@/apis';

interface AppProps extends NextAppProps {
  authenticated: boolean;
}

interface AppContext extends NextAppContext {}

export default function App({ authenticated, pageProps, Component }: AppProps) {
  const checkAuth = useCallback(async () => {
    if (authenticated && !reduxStore.getState().auth.user) {
      const { data } = await AuthAPI.get('/sync');
      reduxStore.dispatch(setUser(data.user));
    }
  }, [authenticated]);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ReduxProvider store={reduxStore}>
      <MuiThemeProvider theme={muiTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider maxSnack={5}>
            <Component {...pageProps} />
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ReduxProvider>
  );
}

App.getInitialProps = async (appCtx: AppContext) => {
  let authenticated: boolean = false;

  const req = appCtx.ctx.req as CookieMessage;

  if (req) {
    req.cookies = cookie.parse(req.headers.cookie + '');

    authenticated = !!req.cookies.act;
  }

  const appProps = await NextApp.getInitialProps(appCtx);

  return {
    ...appProps,
    authenticated,
  };
};
