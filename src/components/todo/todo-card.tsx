import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  ClickAwayListener,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  DoneOutline as DoneOutlineIcon,
  MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { red, orange, blue } from '@material-ui/core/colors';
import moment, { Moment } from 'moment';
import clsx from 'clsx';

// Types
import { ITodo, ITodoValidations, IValidator } from '@/typings';

// Utils
import { todoAPI, Validator } from '@/utils';

// Redux Actions
import {
  addTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
} from '@/redux/actions/todo';
import { setSuccess, setError } from '@/redux/actions/snackbar';

// Components
import TodoDatePicker from './todo-date-picker';
import TodoTimeForm from './todo-time-form';
import TodoPriorityPicker from './todo-priority-picker';

export interface ITodoCardProps {
  todo?: ITodo;
  defaultDate?: Moment | MaterialUiPickersDate;
  mode?: 'add' | 'update' | 'show';
  onCancel?: () => void;
  onComplete?: () => void;
}

export default function TodoCard({
  todo = {} as ITodo,
  defaultDate = moment(),
  mode = 'add',
  onCancel,
  onComplete = () => {},
}: ITodoCardProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modeState, setModeState] = useState<'add' | 'update' | 'show'>(mode);
  const [todoData, setTodoData] = useState<ITodo>({
    name: '',
    due: defaultDate,
    isTimeSet: false,
    dueDate: '',
    dueTime: '',
    priority: 4,
    position: null,
    completed: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [todoErrors, setTodoErrors] = useState<ITodoValidations>({
    name: null,
    dueTime: null,
  });
  const [todoMenuButton, setTodoMenuButton] = useState<HTMLElement | null>(
    null,
  );

  const clearTodoData = (): void => {
    setTodoData({
      name: '',
      due: moment(),
      isTimeSet: false,
      dueDate: '',
      dueTime: '',
      priority: 4,
      position: null,
      completed: false,
    });
  };

  useEffect(() => {
    switch (modeState) {
      case 'add':
        break;

      case 'update':
        setTodoData({
          ...todo,
          due: moment(todo.due),
        });

      default:
        setTodoData({
          ...todo,
          due: moment(todo.due),
        });
        break;
    }
  }, [modeState]);

  useEffect(() => {
    return () => {
      clearTodoData();
    };
  }, []);

  const checkTodoErrors = (): boolean => {
    const { name, dueTime } = todoData;
    const checkedTodoErrors: ITodoValidations = {
      name: Validator.todoName(name),
      dueTime: Validator.dueTime(dueTime),
    };

    setTodoErrors({
      ...todoErrors,
      ...checkedTodoErrors,
    });

    if (
      Object.values(checkedTodoErrors).every(
        (checkedTodoError) => checkedTodoError === null,
      )
    ) {
      return true;
    }

    return false;
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    if (e.target.name === 'name') {
      setTodoErrors({
        ...todoErrors,
        [e.target.name]: Validator.todoName(e.target.value),
      });
    } else {
      setTodoErrors({
        ...todoErrors,
        [e.target.name]: (Validator as IValidator)[e.target.name](
          e.target.value,
        ),
      });
    }

    setTodoData({
      ...todoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTodo = async (
    e:
      | FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>
      | MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (checkTodoErrors()) {
        const { name, due, isTimeSet, priority } = todoData;
        const { data } = await todoAPI.post('/', {
          name,
          due,
          isTimeSet,
          priority,
        });

        setLoading(false);

        dispatch(setSuccess(data.message));
        dispatch(addTodo(data.todo));

        onComplete();
      } else {
        setLoading(false);
        // handle here
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.data) {
        dispatch(setError(err.response.data.message));
      }
    }
  };

  const handleUpdateTodo = async (
    e:
      | FormEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>
      | MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (checkTodoErrors()) {
        const { name, due, isTimeSet, priority } = todoData;
        const { data } = await todoAPI.put(`/${todo._id}`, {
          name,
          due,
          isTimeSet,
          priority,
        });

        setLoading(false);

        dispatch(setSuccess(data.message));
        dispatch(updateTodo(data.todo));

        onComplete();
      } else {
        setLoading(false);
        // handle here
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.data) {
        dispatch(setError(err.response.data.message));
      }
    }
  };

  const handleChangeModeToUpdate = (): void => {
    setModeState('update');
  };

  const handleCancelLocal = (): void => {
    setModeState('show');
  };

  const handleChangeDueDate = async (
    date: MaterialUiPickersDate,
  ): Promise<void> => {
    setLoading(true);

    setTodoData({
      ...todoData,
      due: date,
    });

    const { name, isTimeSet, priority, position, completed } = todoData;

    try {
      if (mode !== 'add') {
        if (checkTodoErrors()) {
          const { data } = await todoAPI.put(`/${todo._id}`, {
            name,
            due: date?.toISOString(),
            isTimeSet,
            priority,
            position,
            completed,
          });

          setLoading(false);

          dispatch(setSuccess(data.message));
          dispatch(updateTodo(data.todo));

          onComplete();
        } else {
          setLoading(false);
          // handle here
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.data) {
        dispatch(setError(err.response.data.message));
      }
    }
  };

  const handleChangeDueTime = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setTodoErrors({
      ...todoErrors,
      dueTime: Validator.dueTime(e.target.value),
    });

    setTodoData({
      ...todoData,
      dueTime: e.target.value,
    });
  };

  const clearDueTimeForm = (): void => {
    setTodoData({
      ...todoData,
      dueTime: '',
    });
  };

  const handleSetDueTime = (): void => {
    let { due, dueTime } = todoData;

    if (dueTime === null || dueTime.length <= 0) {
      setTodoData({
        ...todoData,
        isTimeSet: false,
        dueTime: '',
      });

      return;
    }

    const time = moment(dueTime, 'hh A');

    due = moment(due);

    if (due.get('hour') > time.get('hour')) {
      due = due.add(1, 'day');
    }

    due = due.set({
      hour: time.get('hour'),
      minute: time.get('minute'),
    });

    setTodoData({
      ...todoData,
      due,
      isTimeSet: true,
      dueTime: time.format('hh:mm A'),
    });
  };

  const handleChangeMode = (mode: 'add' | 'update' | 'show'): void => {
    setModeState(mode);
  };

  const handleTodoTimeStatus = (status: 'set' | 'unset'): void => {
    switch (status) {
      case 'set':
        setTodoData({
          ...todoData,
          isTimeSet: true,
        });
        break;

      case 'unset':
        setTodoData({
          ...todoData,
          isTimeSet: false,
          dueTime: '',
        });
        break;

      default:
        break;
    }
  };

  const handleCompleteTodo = async (): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await todoAPI.patch(`/complete/${todo._id}`);

      setLoading(false);

      dispatch(setSuccess(data.message));
      dispatch(completeTodo(data.todo._id));
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.data) {
        dispatch(setError(err.response.data.message));
      }
    }
  };

  const handleShowTodoMenu = (e: MouseEvent<HTMLButtonElement>): void => {
    setTodoMenuButton(e.currentTarget);
  };

  const handleHideTodoMenu = (): void => {
    setTodoMenuButton(null);
  };

  const handleDeleteTodo = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await todoAPI.delete(`/${todo._id}`);

      setLoading(false);

      dispatch(setSuccess(data.message));
      dispatch(deleteTodo(data.todo._id));

      handleHideTodoMenu();
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.data) {
        dispatch(setError(err.response.data.message));
      }
    }
  };

  const handleChangePriority = async (priority: number): Promise<void> => {
    setLoading(true);

    setTodoData({
      ...todoData,
      priority,
    });

    const { name, due, isTimeSet, position, completed } = todoData;

    try {
      if (mode !== 'add') {
        if (checkTodoErrors()) {
          const { data } = await todoAPI.put(`/${todo._id}`, {
            name,
            due,
            isTimeSet,
            priority,
            position,
            completed,
          });

          setLoading(false);

          dispatch(setSuccess(data.message));
          dispatch(updateTodo(data.todo));

          onComplete();
        } else {
          setLoading(false);
          // handle here
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.data) {
        dispatch(setError(err.response.data.message));
      }
    }
  };

  return (
    <ClickAwayListener onClickAway={onCancel || handleCancelLocal}>
      <Card classes={{ root: classes.todoCard }}>
        <CardContent classes={{ root: classes.todoCardContent }}>
          {modeState === 'add' ? (
            <form onSubmit={handleAddTodo}>
              <TextField
                autoFocus
                placeholder={`e.g. Buy some carrots`}
                name={`name`}
                required
                value={todoData.name}
                onChange={handleOnChange}
                // multiline
                error={todoErrors.name !== null && todoErrors.name.length > 0}
                helperText={todoErrors.name}
                disabled={loading}
              />
            </form>
          ) : modeState === 'update' ? (
            <form onSubmit={handleUpdateTodo}>
              <TextField
                autoFocus
                placeholder={`e.g. Buy some carrots`}
                name={`name`}
                required
                value={todoData.name}
                onChange={handleOnChange}
                // multiline
                error={todoErrors.name !== null && todoErrors.name.length > 0}
                helperText={todoErrors.name}
                disabled={loading}
              />
            </form>
          ) : (
            <CardActionArea
              classes={{ root: classes.showTodoNameWrapper }}
              onClick={handleChangeModeToUpdate}
            >
              <Typography
                classes={{ root: classes.todoName }}
                variant={`h5`}
                align={`justify`}
              >
                {todoData.name}
              </Typography>

              <Divider />
            </CardActionArea>
          )}

          <div className={classes.todoPanelWrapper}>
            <div className={classes.todoPanel}>
              <TodoDatePicker todo={todoData} onChange={handleChangeDueDate} />

              <TodoTimeForm
                todo={todoData}
                todoErrors={todoErrors}
                onChange={handleChangeDueTime}
                onComplete={handleSetDueTime}
                clearForm={clearDueTimeForm}
                mode={modeState}
                modeHandler={handleChangeMode}
                statusHandler={handleTodoTimeStatus}
              />

              <TodoPriorityPicker
                todo={todoData}
                onTodoPriorityChange={handleChangePriority}
              />
            </div>

            {mode !== 'add' ? (
              <div className={classes.todoOptionsWrapper}>
                <IconButton size={`small`} onClick={handleShowTodoMenu}>
                  <MoreHorizIcon />
                </IconButton>

                <Menu
                  anchorEl={todoMenuButton}
                  open={Boolean(todoMenuButton)}
                  onClose={handleHideTodoMenu}
                  keepMounted
                >
                  <MenuItem dense onClick={handleDeleteTodo}>
                    Delete Todo
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              ''
            )}
          </div>
        </CardContent>
        {modeState === 'add' ? (
          <CardActions classes={{ root: classes.todoCardActions }}>
            <Tooltip arrow title={`Cancel Add Todo`}>
              <Button
                color={`secondary`}
                onClick={onCancel}
                size={`small`}
                disabled={loading}
              >
                Cancel
              </Button>
            </Tooltip>

            <Tooltip arrow title={`Add Todo`}>
              <Button
                variant={`contained`}
                color={`primary`}
                onClick={handleAddTodo}
                size={`small`}
                disabled={loading}
              >
                Add
              </Button>
            </Tooltip>
          </CardActions>
        ) : modeState === 'update' ? (
          <CardActions classes={{ root: classes.todoCardActions }}>
            <Tooltip arrow title={`Cancel Update Todo`}>
              <Button
                color={`secondary`}
                onClick={onCancel || handleCancelLocal}
                size={`small`}
                disabled={loading}
              >
                Cancel
              </Button>
            </Tooltip>

            <Tooltip arrow title={`Update Todo`}>
              <Button
                variant={`contained`}
                color={`primary`}
                onClick={handleUpdateTodo}
                size={`small`}
                disabled={loading}
              >
                Update
              </Button>
            </Tooltip>
          </CardActions>
        ) : (
          <CardActions classes={{ root: classes.todoCardActionsCenter }}>
            <Tooltip arrow title={`Complete Todo`}>
              <IconButton
                className={clsx({
                  [classes.priority1]: todo.priority === 1,
                  [classes.priority2]: todo.priority === 2,
                  [classes.priority3]: todo.priority === 3,
                })}
                onClick={handleCompleteTodo}
              >
                <DoneOutlineIcon fontSize={`large`} />
              </IconButton>
            </Tooltip>
          </CardActions>
        )}
      </Card>
    </ClickAwayListener>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    todoCard: {
      width: 250,
      height: 250,
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    todoCardContent: {
      width: '100%',
      height: '65%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    },
    todoCardActions: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    todoCardActionsCenter: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    showTodoNameWrapper: {
      width: '100%',
      cursor: 'text',
    },
    todoName: {},
    todoPanelWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing(1),
    },
    todoPanel: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    todoOptionsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    priority1: {
      color: red[500],
    },
    priority2: {
      color: orange[500],
    },
    priority3: {
      color: blue[500],
    },
  }),
);
