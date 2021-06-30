import { FC } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  colors,
  Grid,
  ButtonGroup,
  IconButton,
  Typography,
  Link,
} from '@material-ui/core';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  FavoriteOutlined,
} from '@material-ui/icons';

// Constants
import { GitHubLink, LinkedInLink, PersonalWebsiteLink } from '@/constants';

const Footer: FC<{}> = () => {
  const classes = useStyles();

  return (
    <Grid
      className={classes.wrapper}
      container
      component={`footer`}
      direction={`column`}
      alignItems={`center`}
    >
      <Grid item>
        <ButtonGroup variant={`text`} size={`large`}>
          <IconButton href={GitHubLink} target={`_blank`}>
            <GitHubIcon fontSize={`large`} />
          </IconButton>

          <IconButton href={LinkedInLink} target={`_blank`}>
            <LinkedInIcon fontSize={`large`} />
          </IconButton>
        </ButtonGroup>
      </Grid>

      <Grid item>
        <Typography>
          {`Made with`}{' '}
          <IconButton className={classes.love}>
            <FavoriteOutlined color={`inherit`} fontSize={`small`} />
          </IconButton>{' '}
          {`by`}{' '}
          <Link
            href={PersonalWebsiteLink}
            target={`_blank`}
          >{`rafiandria23.me`}</Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: theme.palette.secondary.main,
      padding: theme.spacing(0.5, 0),
      '& > *': {
        margin: theme.spacing(1, 0),
      },
    },
    love: {
      cursor: 'default',
      padding: 0,
      color: colors.red[500],
    },
  }),
);
