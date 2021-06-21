import { NextPage } from 'next';
import cookie from 'cookie';

// HOCs
import withConditionalRedirect from './with-conditional-redirect';

export default function withoutAuth<P>(
  WrappedComponent: NextPage<P>,
  location: string = '/app',
): NextPage<P> {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: function withoutAuthClientCondition(): boolean {
      return !!cookie.parse(document.cookie)['_xsrf'];
    },
    serverCondition: function withoutAuthServerCondition(ctx) {
      return !!ctx.req?.cookies['act'];
    },
  });
}
