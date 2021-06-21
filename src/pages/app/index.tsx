import { NextPage } from 'next';
import { useRouter } from 'next/router';

// HOCs
import { withAuth } from '@/hocs';

// Components
import { Loading } from '@/components';

const App: NextPage = () => {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.push('/app/today');
  }

  return <Loading />;
};

export default withAuth(App);

App.getInitialProps = (ctx) => {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/app/today' });
    ctx.res.end();
  }
  return {};
};
