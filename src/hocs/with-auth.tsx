import { NextPage } from 'next';
import cookie from 'cookie';

// HOCs
import withConditionalRedirect from './with-conditional-redirect';

export default function withAuth<CP, IP>(
  WrappedComponent: NextPage<CP, IP>,
  location: string = '/signin',
): NextPage<CP, IP> {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: function withAuthClientCondition(): boolean {
      return !cookie.parse(document.cookie)['_csrf'];
    },
    serverCondition: function withAuthServerCondition(ctx): boolean {
      return !ctx.req?.cookies['act'];
    },
  });
}
