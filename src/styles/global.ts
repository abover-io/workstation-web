import { CSSProperties } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;

const useStyles = makeStyles(() =>
  createStyles({
    '@global': {
      a: {
        cursor: 'pointer',
      } as CSSProperties,
      '.MuiButton-label': {
        textTransform: 'none',
      } as CSSProperties,
    },
  }),
);
