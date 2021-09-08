import 'fontsource-roboto';

import { useEffect, useCallback, createRef, RefObject } from 'react';
import NextApp, {
  AppProps as NextAppProps,
  AppContext as NextAppContext,
} from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import cookie from 'cookie';
import { SnackbarProvider, SnackbarKey } from 'notistack';

// Moment Locale Config
moment.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    lastWeek: '[Last] dddd',
    nextWeek: '[Next] dddd',
    sameElse: 'MMM D',
  },
});

// API
import api from '@/api';

// Types
import { CookieMessage } from '@/types';

// Redux
import reduxStore from '@/redux';
import { setUser } from '@/redux/actions/auth';
import { setTotalLists, setLists } from '@/redux/actions/list';

// Styles
import { muiTheme } from '@/styles';

interface AppProps extends NextAppProps {
  authenticated: boolean;
}

interface AppContext extends NextAppContext {}

export default function App({ authenticated, pageProps, Component }: AppProps) {
  const notistackRef: RefObject<SnackbarProvider> = createRef();

  const checkAuth = useCallback(async () => {
    try {
      if (authenticated && reduxStore.getState().auth.user === null) {
        const {
          data: { user },
        } = await api.get('/auth/sync');
        const {
          data: { total: totalLists, lists },
        } = await api.get('/lists');
        reduxStore.dispatch(setUser(user));
        reduxStore.dispatch(setTotalLists(totalLists));
        reduxStore.dispatch(setLists(lists));
      }
    } catch (err) {}
  }, [authenticated]);

  useEffect(() => {
    checkAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseSnackbar = (key: SnackbarKey) => {
    notistackRef.current?.closeSnackbar(key);
  };

  return (
    <ReduxProvider store={reduxStore}>
      <MuiThemeProvider theme={muiTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <SnackbarProvider
            ref={notistackRef}
            maxSnack={1}
            autoHideDuration={3000}
            action={(key) => (
              <IconButton
                color={`inherit`}
                onClick={() => handleCloseSnackbar(key)}
              >
                <CloseIcon />
              </IconButton>
            )}
          >
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
