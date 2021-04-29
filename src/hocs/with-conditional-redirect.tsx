import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

// Typings
import { CookiesPageContext } from '@/types';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export default function withConditionalRedirect<CP = {}, IP = CP>({
  WrappedComponent,
  clientCondition,
  serverCondition,
  location,
}: {
  WrappedComponent: NextPage<CP, IP>;
  clientCondition: () => boolean;
  serverCondition: (ctx: CookiesPageContext) => boolean;
  location: string;
}): NextPage<CP, IP> {
  const WithConditionalRedirectWrapper: NextPage<CP, IP> = (props) => {
    const classes = useStyles();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    const checkRedirectCondition = useCallback(async () => {
      const redirectCondition: boolean = clientCondition();

      if (isBrowser() && redirectCondition) {
        await router.replace(location);
        return;
      }

      setLoading(false);
    }, []);

    useEffect(() => {
      checkRedirectCondition();
    }, []);

    return loading ? (
      <section className={classes.wrapper}>
        <LinearProgress
          classes={{ root: classes.linearProgress }}
          color={`secondary`}
        />
      </section>
    ) : (
      <WrappedComponent {...props} />
    );
  };

  WithConditionalRedirectWrapper.getInitialProps = async (ctx): Promise<IP> => {
    if (!isBrowser() && ctx.res) {
      if (serverCondition(ctx as CookiesPageContext)) {
        ctx.res.writeHead(302);
        ctx.res.end();
      }
    }

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return {
      ...(componentProps as IP),
    };
  };

  return WithConditionalRedirectWrapper;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: '100%',
      height: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    linearProgress: {
      width: theme.spacing(64),
    },
  }),
);
