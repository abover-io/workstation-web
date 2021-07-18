import { createTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

export default createTheme({
  palette: {
    primary: {
      main: colors.blue[500],
    },
    secondary: {
      main: colors.blueGrey[50],
    },
  },
});
