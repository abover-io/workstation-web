import React, { FC, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';

// HOCs
import { withAuth } from '@/hocs';

// Components
import { AppLayout } from '@/components/app';
import { ListItem } from '@/components/list';

// APIs
import { ListAPI } from '@/apis';

// Redux Actions
import { setLists } from '@/redux/actions/list';

// Custom Hooks
import { useList } from '@/hooks';

const App: FC<{}> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const { list } = useList();

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await ListAPI.get('/');

      dispatch(setLists(data.lists));

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response.data) {
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <AppLayout title={`My Lists`}>
      <Grid container direction={`column`} alignItems={`stretch`}>
        <Grid item>
          <Typography
            className={classes.title}
            variant={`h6`}
            align={`left`}
            gutterBottom
          >
            My Lists
          </Typography>
        </Grid>

        {list.map((list) => (
          <Grid item key={list._id}>
            <ListItem list={list} />
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
};

export default withAuth(App);

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);
