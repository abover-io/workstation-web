import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

// Typings
import { CookiesPageContext } from '@/types';

// Components
import { Loading } from '@/components';

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
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    const checkRedirectCondition = useCallback(async () => {
      const redirectCondition: boolean = clientCondition();

      if (isBrowser() && redirectCondition) {
        await router.push(location);
        return;
      }

      setLoading(false);
    }, []);

    useEffect(() => {
      checkRedirectCondition();
    }, []);

    return loading ? <Loading /> : <WrappedComponent {...props} />;
  };

  WithConditionalRedirectWrapper.getInitialProps = async (ctx): Promise<IP> => {
    if (!isBrowser() && ctx.res) {
      if (serverCondition(ctx as CookiesPageContext)) {
        ctx.res.writeHead(302, { location });
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
