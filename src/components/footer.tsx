import { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  colors,
  Grid,
  Divider,
  IconButton,
  Typography,
  Link,
} from '@material-ui/core';
import {
  GitHub as GitHubIcon,
  Favorite as FavoriteIcon,
} from '@material-ui/icons';

// Constants
import { GitHubLink, PersonalWebsiteLink } from '@/constants';

const Footer: FC<{}> = () => {
  const classes = useStyles();

  return (
    <Grid
      className={classes.wrapper}
      container
      component={`footer`}
      direction={`column`}
      spacing={2}
    >
      <Grid item>
        <Divider />
      </Grid>

      <Grid item container direction='row' justifyContent='center'>
        <Grid item>
          <Typography>
            {`Made with`}{' '}
            <IconButton className={classes.love}>
              <FavoriteIcon color={`inherit`} fontSize={`small`} />
            </IconButton>{' '}
            {`by`}{' '}
            <Link
              href={PersonalWebsiteLink}
              target={`_blank`}
            >{`rafiandria23.me`}</Link>
          </Typography>
        </Grid>
      </Grid>

      <Grid item container direction='row' justifyContent='center' spacing={1}>
        <Grid item>
          <IconButton href={GitHubLink} target={`_blank`}>
            <GitHubIcon fontSize='large' />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Footer;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      // padding: theme.spacing(0.5, 0),
      // '& > *': {
      //   margin: theme.spacing(1, 0),
      // },
      marginTop: theme.spacing(1),
    },
    love: {
      cursor: 'default',
      padding: 0,
      color: colors.red[500],
    },
  }),
);
