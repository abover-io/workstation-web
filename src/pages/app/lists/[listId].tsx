import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FiberManualRecord as FiberManualRecordIcon } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import update from 'immutability-helper';

// Types
import { Todo } from '@/types/todo';

// API
import api from '@/api';

// HOCs
import { withAuth } from '@/hocs';

// Custom Hooks
import { useList, useTodo } from '@/hooks';

// Components
import { Loading } from '@/components';
import { AppLayout } from '@/components/app';
import TodoList, { TodoListProps } from '@/components/todo/todo-list';

// Redux Actions
import { setTotalTodos, setTodos, addTodo } from '@/redux/actions/todo';

const ListPage: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { lists } = useList();
  const { todos } = useTodo();

  const { listId } = router.query;

  const list = lists.filter((l) => l._id === listId)[0];

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/todos', {
        params: {
          listId,
          due: 'all',
        },
      });

      dispatch(setTotalTodos(data.total));
      dispatch(setTodos(data.todos));

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.response) {
        if (err.response.status === 400 || err.response.status === 404) {
          enqueueSnackbar(err.response.data.message, {
            variant: 'error',
            persist: false,
          });
          router.replace('/app');
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTodos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinishAddTodo: TodoListProps['onFinishAdd'] = (todo) => {
    if (todo.due.isSame(moment(), 'd')) {
      dispatch(addTodo(todo));
    }
  };

  return !list || loading ? (
    <Loading />
  ) : (
    <AppLayout title={list.name}>
      <Grid container direction={`column`} spacing={2}>
        {/* Header */}
        <Grid item>
          <ListItem className={classes.headerTitle}>
            <ListItemIcon style={{ color: list.color }}>
              <FiberManualRecordIcon color={`inherit`} />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5' }}
              primary={list.name}
            />
          </ListItem>
        </Grid>

        {/* Body */}
        <Grid item>
          <TodoList
            list={list}
            todos={todos}
            onFinishAdd={handleFinishAddTodo}
          />
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default withAuth(ListPage);

const useStyles = makeStyles(() =>
  createStyles({
    headerTitle: {
      padding: 0,
    },
  }),
);
