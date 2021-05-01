import React, { FC, ReactNode } from 'react';

// Components
import CustomHead from './custom-head';

type AppLayoutProps = {
  title: string;
  children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ title, children }) => {
  return (
    <>
      <CustomHead title={title} />

      {/* <Header /> */}

      {children}

      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
