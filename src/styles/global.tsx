import { FC, CSSProperties } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const GlobalStyles: FC<{}> = () => {
  useStyles();

  return <CssBaseline />;
};

export default GlobalStyles;

const useStyles = makeStyles((theme) =>
  createStyles({
    '@global': {
      a: {
        cursor: 'pointer',
      } as CSSProperties,
      '.MuiButton-label': {
        textTransform: 'none',
      } as CSSProperties,
      '.MuiListItemIcon-root': {
        minWidth: theme.spacing(4),
      } as CSSProperties,
    },
  }),
);
