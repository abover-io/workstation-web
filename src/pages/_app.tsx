import 'fontsource-roboto';

import React, { useEffect, useCallback, useState } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { useCookies } from 'react-cookie';

import { Loading } from '@/components';

// Redux Store
import reduxStore from '@/redux';

// Styles
import '@/styles/global.scss';
import { muiTheme } from '@/styles';

export default function App({ Component, pageProps }: AppProps) {
  const [cookies] = useCookies(['XSRF-TOKEN']);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuthWithUseCallback = useCallback(async () => {
    if (router.pathname === '/signup' || router.pathname === '/signin') {
      if (cookies['XSRF-TOKEN'] && cookies['XSRF-TOKEN'].length > 0) {
        await router.replace('/app');
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    checkAuthWithUseCallback();
  }, []);

  return (
    <ReduxProvider store={reduxStore}>
      <MuiThemeProvider theme={muiTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {loading ? <Loading /> : <Component {...pageProps} />}
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ReduxProvider>
  );
}
