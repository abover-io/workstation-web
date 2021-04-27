import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Calendar } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment, { Moment } from 'moment';

import { Loading, AppLayout, TodoList } from '@/components';
import { userAPI } from '@/utils';

// Redux Actions
import { setUser } from '@/redux/actions/user';
import { setTodos as setTodosRedux } from '@/redux/actions/todo';
import { setWarning, setError } from '@/redux/actions/snackbar';

// Typings
import { IRootState, ITodo } from '@/typings';

export interface IAppProps {}

export default function App({}: IAppProps) {
  const [cookies] = useCookies(['rft']);
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [todos, setTodos] = useState<ITodo[]>([] as ITodo[]);
  const [currentDate, setCurrentDate] = useState<
    Moment | MaterialUiPickersDate
  >(moment());
  const { selectedTodoCategory } = useSelector(
    (state: IRootState) => state.current,
  );
  const { todos: todosFromRedux } = useSelector(
    (state: IRootState) => state.todo,
  );

  const syncWithUseCallback = useCallback(async (): Promise<void> => {
    try {
      const { data } = await userAPI.get('/sync');

      dispatch(setUser(data.user));
      dispatch(setTodosRedux(data.todos));
      setLoading(false);
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            try {
              if (cookies['rft'] && cookies['rft'].length > 0) {
                await userAPI.post('/refresh');
                const { data: syncData } = await userAPI.get('/sync');
                dispatch(setUser(syncData.user));
                dispatch(setTodosRedux(syncData.Todos));
                setLoading(false);
              } else {
                setLoading(false);
                await router.push('/signin');
                dispatch(setWarning(`Please sign in to continue`));
              }
            } catch (err2) {
              if (err.response) {
                setLoading(false);
                await router.push('/signin');
                dispatch(setError(err2.response.data.message));
              }
            }
            break;

          default:
            setLoading(false);
            dispatch(setError(err.response.data.message));
            break;
        }
      } else if (err.message) {
        setLoading(false);
        dispatch(setError(err.message));
      } else {
        setLoading(false);
        dispatch(setError(`Unknown error has occurred!`));
        // Report bugs action (soon)
      }
    }
  }, []);

  useEffect((): void => {
    syncWithUseCallback();
  }, []);

  useEffect((): void => {
    switch (selectedTodoCategory.toLowerCase()) {
      case 'inbox':
        setTodos(
          [...todosFromRedux].sort((todoA, todoB) =>
            moment(todoA.due).diff(moment(todoB.due)),
          ),
        );
        break;

      case 'today':
        setTodos(
          [...todosFromRedux].filter((todo) =>
            moment(todo.due).isSame(moment(), 'day'),
          ),
        );
        break;

      case 'upcoming':
        setTodos(
          [...todosFromRedux].filter((todo) =>
            moment(todo.due).isSame(currentDate, 'day'),
          ),
        );
        break;
    }
  }, [selectedTodoCategory, todosFromRedux]);

  const onChangeDate = (date: MaterialUiPickersDate) => {
    if (date && date!.isValid()) {
      setCurrentDate(date);

      setTodos(
        [...todosFromRedux].filter((todo) =>
          moment(todo.due).isSame(date, 'day'),
        ),
      );
    }
  };

  const decideRender = (): JSX.Element | undefined => {
    const overdueTodos = todosFromRedux.filter(
      (todo) =>
        moment(todo.due).isBefore(moment(), 'date') && todo.completed === false,
    );

    switch (selectedTodoCategory.toLowerCase()) {
      case 'inbox':
        return <TodoList category={`inbox`} todos={todos} />;

      case 'today':
        if (overdueTodos.length > 0) {
          return (
            <>
              <TodoList
                category={'overdue'}
                todos={overdueTodos}
                addTodoCard={false}
              />

              <TodoList category={selectedTodoCategory} todos={todos} />
            </>
          );
        } else {
          return <TodoList category={selectedTodoCategory} todos={todos} />;
        }

      case 'upcoming':
        return (
          <Grid
            container
            spacing={8}
            justify={`space-between`}
            alignItems={`stretch`}
          >
            <Grid item xs={3}>
              <Calendar
                date={currentDate}
                onChange={onChangeDate}
                minDate={moment()}
              />
            </Grid>

            <Grid item xs={9}>
              {overdueTodos.length > 0 ? (
                <>
                  <TodoList
                    category={'overdue'}
                    todos={overdueTodos}
                    addTodoCard={false}
                  />

                  <TodoList
                    category={selectedTodoCategory}
                    todos={todos}
                    currentDate={currentDate}
                  />
                </>
              ) : (
                <TodoList
                  category={selectedTodoCategory}
                  todos={todos}
                  currentDate={currentDate}
                />
              )}
            </Grid>
          </Grid>
        );

      default:
        return <TodoList category={selectedTodoCategory} todos={todos} />;
    }
  };

  return <>{loading ? <Loading /> : <AppLayout>{decideRender()}</AppLayout>}</>;
}

const useStyles = makeStyles(() => createStyles({}));
