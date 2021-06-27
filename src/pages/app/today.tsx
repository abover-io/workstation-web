import { useState, useEffect, useCallback } from 'react';
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

const Today: NextPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const { total, todos } = useTodo();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/todos', {
        params: {
          due: moment().format('MM-DD-YYYY'),
        },
      });

      dispatch(setTotalTodos(data.total));
      dispatch(setTodos(data.todos));

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFinishAddTodo: TodoListProps['onFinishAdd'] = (todo) => {
    if (todo.due === null || moment(todo.due).isSame(moment(), 'd')) {
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

export default withAuth(Today);
