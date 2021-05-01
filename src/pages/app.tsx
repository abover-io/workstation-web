import React, { FC, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
    <AppLayout>
      <h2>Loading: {loading}</h2>

      <h1>My Lists</h1>

      {list.map((list) => (
        <ListItem key={list._id} list={list} />
      ))}
    </AppLayout>
  );
};

export default withAuth(App);
