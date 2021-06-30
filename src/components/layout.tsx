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
  header?: boolean;
  footer?: boolean;
}

const Layout: FC<LayoutProps> = ({
  title,
  children,
  header = true,
  footer = true,
}) => {
  return (
    <>
      <CustomHead title={title} />
      <GlobalStyles />

      {header && <Header />}

      <main>
        {header && <Toolbar />}
        {children}
      </main>

      {footer && <Footer />}
    </>
  );
};

export default Layout;
