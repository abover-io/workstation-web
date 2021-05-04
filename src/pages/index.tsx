import { useRouter } from 'next/router';
import React, { useEffect, FC } from 'react';

import { Layout, Loading } from '@/components';

const Index: FC<{}> = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, []);

  return (
    <Layout>
      <Loading />
    </Layout>
  );
};

export default Index;
