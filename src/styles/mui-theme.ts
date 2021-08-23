import { createTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

export default createTheme({
  palette: {
    primary: {
      main: colors.blue[500],
      contrastText: colors.common.white,
    },
    secondary: {
      main: colors.red[500],
      contrastText: colors.common.white,
    },
  },
});
