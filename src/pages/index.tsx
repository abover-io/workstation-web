import { useRouter } from 'next/router';
import React, { useEffect, FC } from 'react';

import { Layout } from '@/components';

const Home: FC<{}> = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, []);

  return (
    <Layout title={`Home`}>
      <div>Loading...</div>
    </Layout>
  );
};

export default Home;
