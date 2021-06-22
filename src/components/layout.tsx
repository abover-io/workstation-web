import React, { FC, ReactNode } from 'react';

// Components
import CustomHead from './custom-head';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <CustomHead title={title} />

      {/* <Header /> */}

      {children}

      {/* <Footer /> */}
    </>
  );
};

export default Layout;
