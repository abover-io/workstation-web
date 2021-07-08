import { FC, ReactNode, CSSProperties } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
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
  header = false,
  footer = false,
}) => {
  const classes = useStyles();

  return (
    <>
      <CustomHead title={title} />
      <GlobalStyles />

      {header && <Header />}

      <main className={classes.main}>
        {header && <Toolbar />}
        {children}
      </main>

      {footer && <Footer />}
    </>
  );
};

export default Layout;

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      margin: theme.spacing(2, 0),
    },
  }),
);
