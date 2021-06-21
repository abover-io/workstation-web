import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import { Grid, Typography, Divider } from '@material-ui/core';
import moment from 'moment';
import update from 'immutability-helper';

// API
import api from '@/api';

// Types
import { Todo } from '@/types/todo';

// HOCs
import { withAuth } from '@/hocs';

// Components
import { AppLayout } from '@/components/app';
import { AddTodoForm } from '@/components/todo';

// Redux Actions

const Today: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/todos', {
        params: {
          due: moment().format('MM-DD-YYYY'),
        },
      });

      setTotal(data.total);
      setTodos(data.todos);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFinishAddTodo = (todo: Todo) => {
    setTodos(
      update(todos, {
        $push: [todo],
      }),
    );
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

        <Grid item>
          <Divider />
        </Grid>

        {/* Body */}
        <Grid item container direction={`column`}>
          {todos.map((todo) => (
            <Grid item key={todo._id}>
              <Typography variant={`caption`}>{todo.name}</Typography>
            </Grid>
          ))}

          <Grid item>
            <AddTodoForm onFinish={handleFinishAddTodo} />
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default withAuth(Today);
