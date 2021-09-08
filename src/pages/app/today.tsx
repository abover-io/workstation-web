import { useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import { useDispatch } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import moment from 'moment';

// API
import api from '@/api';

// HOCs
import { withAuth } from '@/hocs';

// Custom Hooks
import { useTodo } from '@/hooks';

// Components
import { AppLayout } from '@/components/app';
import TodoList, { TodoListProps } from '@/components/todo/todo-list';

// Redux Actions
import { setTotalTodos, setTodos, addTodo } from '@/redux/actions/todo';

const TodayPage: NextPage = () => {
  const dispatch = useDispatch();
  const { todos } = useTodo();

  const fetchTodos = useCallback(async () => {
    try {
      const { data } = await api.get('/todos', {
        params: {
          due: moment().format('MM-DD-YYYY'),
        },
      });

      dispatch(setTotalTodos(data.total));
      dispatch(setTodos(data.todos));
    } catch (err) {}

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

  return (
    <AppLayout title={`Today`}>
      <Grid container direction={`column`} spacing={2}>
        {/* Header */}
        <Grid item container alignItems={`baseline`} spacing={1}>
          <Grid item>
            <Typography variant={`h5`}>{`Today`}</Typography>
          </Grid>

          <Grid item>
            <Typography variant={`caption`}>
              {moment().format('dddd, MMMM D')}
            </Typography>
          </Grid>
        </Grid>

        {/* Body */}
        <Grid item>
          <TodoList todos={todos} onFinishAdd={handleFinishAddTodo} />
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default withAuth(TodayPage);
