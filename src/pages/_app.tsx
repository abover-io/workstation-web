import 'fontsource-roboto';

import React, { useEffect, useCallback, useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { useRouter } from 'next/router';
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

interface CustomAppProps extends AppProps {
  authenticated: boolean;
}

interface CustomAppContext extends AppContext {}

export default function App({
  authenticated,
  Component,
  pageProps,
}: CustomAppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);

    if (authenticated && !reduxStore.getState().auth.user) {
      const { data } = await AuthAPI.get('/sync');

      reduxStore.dispatch(setUser(data.user));

      setLoading(false);
    } else {
      await router.push('/signin');
    }
  }, [authenticated]);

  useEffect(() => {
    checkAuth();

    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <ReduxProvider store={reduxStore}>
      <MuiThemeProvider theme={muiTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider maxSnack={5}>
            {loading ? <Loading /> : <Component {...pageProps} />}
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ReduxProvider>
  );
}

App.getInitialProps = async (appCtx: CustomAppContext) => {
  let authenticated: boolean = false;

  const req = appCtx.ctx.req as CookieMessage;

  if (req) {
    req.cookies = cookie.parse(req.headers.cookie as string);

    authenticated = !!req.cookies.act;
  }

  const appProps = await NextApp.getInitialProps(appCtx);

  return {
    ...appProps,
    authenticated,
  };
};
