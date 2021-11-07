import { FC, CSSProperties } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  colors,
  Grid,
  Typography,
  ImageList,
  ImageListItem,
  ButtonGroup,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  Language as WebIcon,
  Apple as AppleIcon,
  Android as AndroidIcon,
} from '@material-ui/icons';

// Icons
import ReactIcon from '@/assets/icons/react-icon.svg';
import NextJsIcon from '@/assets/icons/nextjs-icon.svg';
import MaterialUiIcon from '@/assets/icons/materialui-icon.svg';

// Components
import { Layout } from '@/components';

const Home: FC<{}> = () => {
  const classes = useStyles();

  return (
    <Layout header footer>
      <Grid
        className={classes.wrapper}
        container
        direction={`column`}
        justifyContent={`space-around`}
        alignItems={`center`}
      >
        <Grid item>
          <Typography variant={`h2`} align={`center`} gutterBottom>
            Todo
          </Typography>

          <Typography variant={`h5`} align={`center`} paragraph>
            The open-source to do list application, starting from bootcamp
            project to production-scale application.
          </Typography>
        </Grid>

        <Grid className={classes.banner} item>
          <Typography variant={`h4`} align={`center`} gutterBottom>
            Built using
          </Typography>

          <ImageList rowHeight={`auto`} cols={2}>
            <ImageListItem cols={2}>
              <NextJsIcon height={120} />
            </ImageListItem>

            <ImageListItem cols={1}>
              <ReactIcon height={120} />
            </ImageListItem>

            <ImageListItem cols={1}>
              <MaterialUiIcon height={120} />
            </ImageListItem>
          </ImageList>
        </Grid>

        <Grid item>
          <Typography variant={`h5`} align={`right`} gutterBottom>
            Bootcamp Project
          </Typography>

          <Typography variant={`subtitle1`} align={`justify`} paragraph>
            Yes, it started from a bootcamp project, it was previously built
            using Vue.js and Express. But, I take it to a whole new level using
            Next.js, TypeScript, and Express.js
          </Typography>
        </Grid>

        <Grid className={classes.banner} item>
          <Typography variant={`h5`} align={`left`} gutterBottom>
            Open-Source
          </Typography>

          <Typography variant={`subtitle1`} paragraph>
            From day one, you can always see the source code of Sunday Todo,
            both its web client and its API and upcoming cross platform apps of
            Sunday Todo.
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant={`h5`} align={`center`} gutterBottom>
            It&apos;s everywhere
          </Typography>

          <ButtonGroup size={`large`}>
            <Tooltip title={`Sunday Todo on Web`}>
              <IconButton>
                <WebIcon fontSize={`large`} />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Sunday Todo on iOS (under development)`}>
              <IconButton>
                <AppleIcon fontSize={`large`} />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Sunday Todo on Android (under development)`}>
              <IconButton>
                <AndroidIcon fontSize={`large`} />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      '& > .MuiGrid-item': {
        padding: theme.spacing(4, 2),
      } as CSSProperties,
    },
    banner: {
      background: colors.grey[200],
      width: '100%',
    },
  }),
);
