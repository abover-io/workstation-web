import { FC, ReactNode } from 'react';
import { Toolbar } from '@material-ui/core';

// Styles
import { GlobalStyles } from '@/styles';

// Components
import CustomHead from './custom-head';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <CustomHead title={title} />
      <GlobalStyles />

      <Header />

      <main>
        <Toolbar />
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;
