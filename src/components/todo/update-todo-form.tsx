import {
  FC,
  useState,
  useEffect,
  FormEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  ButtonGroup,
  Button,
  TextField,
  TextFieldProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Divider,
} from '@material-ui/core';
import { DatePicker, DatePickerProps } from '@material-ui/pickers';
import {
  AddOutlined,
  FlagOutlined,
  FiberManualRecord as FiberManualRecordIcon,
  InboxOutlined,
  CalendarTodayOutlined,
  ClearOutlined,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import moment, { Moment } from 'moment';
import update from 'immutability-helper';

// API
import api from '@/api';

// Types
import { Validation } from '@/types';
import {
  Todo,
  UpdateTodoFormValidation,
  UpdateTodoFormData,
} from '@/types/todo';

// Constants
import { TodoPriorityOptions, TodoDueTimeFormats } from '@/constants/todo';

// Custom Hooks
import { useAuth, useList } from '@/hooks';

// Utils
import { TodoValidator } from '@/utils/validator';

export interface UpdateTodoFormProps {
  todo: Todo;
  open: boolean;
  overlay?: ReactNode;
  onClose: () => Promise<void> | void;
  onFinish: (todo: Todo) => Promise<void> | void;
}

const UpdateTodoForm: FC<UpdateTodoFormProps> = ({
  todo,
  open,
  overlay,
  onClose,
  onFinish,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { lists } = useList();
  const [loading, setLoading] = useState<boolean>(false);
  const [dueAnchorEl, setDueAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const [dueTimeAnchorEl, setDueTimeAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [listAnchorEl, setListAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const [priorityAnchorEl, setPriorityAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [validations, setValidations] = useState<UpdateTodoFormValidation>({
    listId: {
      error: false,
      text: '',
    },
    name: {
      error: false,
      text: '',
    },
    notes: {
      error: false,
      text: '',
    },
    url: {
      error: false,
      text: '',
    },
    isDateSet: {
      error: false,
      text: '',
    },
    isTimeSet: {
      error: false,
      text: '',
    },
    due: {
      error: false,
      text: '',
    },
    priority: {
      error: false,
      text: '',
    },
  });
  const [dueTimeValidation, setDueTimeValidation] = useState<Validation>({
    error: false,
    text: '',
  });
  const [dueTimeInput, setDueTimeInput] = useState<string>('');
  const [dueTime, setDueTime] = useState<Moment | null>(null);
  const [formData, setFormData] = useState<UpdateTodoFormData>({
    list: null,
    name: '',
    notes: null,
    url: null,
    isDateSet: true,
    isTimeSet: false,
    due: moment().set({
      h: 0,
      m: 0,
      s: 0,
    }),
    priority: TodoPriorityOptions[0],
  });

  useEffect(() => {
    setFormData(
      update(formData, {
        list: {
          $set: lists.filter((list) => list._id === todo.listId)[0] || null,
        },
        name: {
          $set: todo.name,
        },
        notes: {
          $set: todo.notes || null,
        },
        url: {
          $set: todo.url || null,
        },
        isDateSet: {
          $set: todo.isDateSet || true,
        },
        isTimeSet: {
          $set: todo.isTimeSet || false,
        },
        due: {
          $set:
            moment(todo.due) ||
            moment().set({
              h: 0,
              m: 0,
              s: 0,
            }),
        },
        priority: {
          $set:
            TodoPriorityOptions.filter(
              (priority) => priority.value === todo.priority,
            )[0] || TodoPriorityOptions[0],
        },
      }),
    );
  }, [todo]);

  const handleOpenDue = (e: MouseEvent<HTMLButtonElement>) => {
    setDueAnchorEl(e.currentTarget);
  };
  const handleCloseDue = () => {
    setDueAnchorEl(null);
  };
  const handleOpenDueTime = (e: MouseEvent<HTMLButtonElement>) => {
    if (formData.isTimeSet) {
      setDueTimeInput((formData.due as Moment).format('hh:mm A'));
      setDueTime(formData.due as Moment);
    }

    setDueTimeAnchorEl(e.currentTarget);
  };
  const handleCloseDueTime = () => {
    setDueTimeValidation({
      error: false,
      text: '',
    });
    setDueTimeInput('');
    setDueTime(null);
    setDueTimeAnchorEl(null);
  };

  const handleOpenList = (e: MouseEvent<HTMLButtonElement>) => {
    setListAnchorEl(e.currentTarget);
  };
  const handleCloseList = () => {
    setListAnchorEl(null);
  };

  const handleOpenPriority = (e: MouseEvent<HTMLButtonElement>) => {
    setPriorityAnchorEl(e.currentTarget);
  };
  const handleClosePriority = () => {
    setPriorityAnchorEl(null);
  };

  const handleChangeName: TextFieldProps['onChange'] = (e) => {
    setValidations(
      update(validations, {
        name: {
          $set: TodoValidator.Name(e.target.value),
        },
      }),
    );

    setFormData(
      update(formData, {
        name: {
          $set: e.target.value,
        },
      }),
    );
  };
  const handleChangeDue: DatePickerProps['onChange'] = (due) => {
    setFormData(
      update(formData, {
        due: {
          $set: due,
        },
      }),
    );
    setDueAnchorEl(null);
  };
  const handleChangeDueTime: TextFieldProps['onChange'] = (e) => {
    setDueTimeInput(e.target.value);

    const input: Moment = moment(e.target.value, TodoDueTimeFormats, true);

    if (input.isValid()) {
      setDueTimeValidation({
        error: false,
        text: '',
      });

      setDueTime(input);
    } else {
      setDueTimeValidation({
        error: true,
        text: 'Invalid time!',
      });
      setDueTime(null);
    }
  };
  const handleSetDueTime = (e: FormEvent) => {
    e.preventDefault();

    if (dueTime !== null) {
      setFormData(
        update(formData, {
          isDateSet: {
            $set: true,
          },
          isTimeSet: {
            $set: true,
          },
          due: {
            $set:
              formData.due === null
                ? dueTime
                : (formData.due as Moment).set({
                    h: dueTime.get('h'),
                    m: dueTime.get('m'),
                  }),
          },
        }),
      );
      handleCloseDueTime();
    }
  };
  const handleUnsetDueTime = () => {
    setDueTimeValidation({
      error: false,
      text: '',
    });
    setDueTimeInput('');
    setDueTime(null);
    setFormData(
      update(formData, {
        isTimeSet: {
          $set: false,
        },
        due: {
          $set: (formData.due as Moment).set({
            h: 0,
            m: 0,
          }),
        },
      }),
    );
  };

  const handleChangeList = (list: UpdateTodoFormData['list']) => {
    setFormData(
      update(formData, {
        list: {
          $set: list,
        },
      }),
    );
    setListAnchorEl(null);
  };

  const handleChangePriority = (priority: UpdateTodoFormData['priority']) => {
    setFormData(
      update(formData, {
        priority: {
          $set: priority,
        },
      }),
    );
    setPriorityAnchorEl(null);
  };

  const handleUpdateTodo = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (
        Object.values(validations).every(
          (validation) => validation.error === false,
        )
      ) {
        setLoading(true);

        const { data } = await api.put(`/todos/${todo._id}`, {
          userId: user!._id,
          listId: formData.list !== null ? formData.list._id : null,
          name: formData.name,
          notes: formData.notes,
          url: formData.url,
          isDateSet: formData.isDateSet,
          isTimeSet: formData.isTimeSet,
          due: formData.due,
          priority: formData.priority.value,
        });

        enqueueSnackbar(data.message, {
          variant: 'success',
          persist: false,
        });

        setLoading(false);

        onClose();
        onFinish(data.todo);
      }
    } catch (err) {
      setLoading(false);

      if (err.response) {
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
          persist: false,
        });
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {!open && overlay}

      {open && (
        <Grid
          className={classes.wrapper}
          container
          component={`form`}
          onSubmit={handleUpdateTodo}
          direction={`column`}
          spacing={1}
        >
          {/* Todo Name */}
          <Grid item>
            <TextField
              fullWidth
              variant={`outlined`}
              disabled={loading}
              multiline
              required
              placeholder={`e.g. Study Calculus.`}
              value={formData.name}
              onChange={handleChangeName}
              error={validations.name.error}
              helperText={validations.name.text}
            />
          </Grid>

          {/* Todo Attributes => The rest of them. */}
          <Grid
            item
            container
            wrap={`wrap`}
            justify={`flex-start`}
            alignItems={`center`}
            spacing={1}
          >
            <Grid item>
              <Button
                variant={`outlined`}
                disabled={loading}
                startIcon={<CalendarTodayOutlined />}
                onClick={handleOpenDue}
              >
                {(formData.due as Moment).calendar()}
              </Button>

              <Popover
                open={Boolean(dueAnchorEl)}
                anchorEl={dueAnchorEl}
                onClose={handleCloseDue}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <DatePicker
                  autoOk
                  disableToolbar
                  disablePast
                  variant={`static`}
                  disabled={loading}
                  openTo={`date`}
                  value={formData.due}
                  onChange={handleChangeDue}
                />

                <Divider />

                <Grid
                  className={classes.timePanel}
                  container
                  justify={`space-between`}
                >
                  {!formData.isTimeSet ? (
                    <Button
                      variant={`text`}
                      disabled={loading}
                      startIcon={<AddOutlined />}
                      onClick={handleOpenDueTime}
                    >{`Add Time`}</Button>
                  ) : (
                    <ButtonGroup variant={`outlined`} disabled={loading}>
                      <Button onClick={handleOpenDueTime}>
                        {(formData.due as Moment).format('hh:mm A')}
                      </Button>

                      <Button onClick={handleUnsetDueTime}>
                        <ClearOutlined />
                      </Button>
                    </ButtonGroup>
                  )}
                </Grid>

                <Popover
                  open={Boolean(dueTimeAnchorEl)}
                  anchorEl={dueTimeAnchorEl}
                  onClose={handleCloseDueTime}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  PaperProps={{
                    className: classes.timePaper,
                  }}
                >
                  <Grid
                    container
                    component={`form`}
                    direction={`column`}
                    spacing={1}
                    onSubmit={handleSetDueTime}
                  >
                    <Grid item>
                      <TextField
                        fullWidth
                        disabled={loading}
                        size={`small`}
                        label={`Time`}
                        placeholder={`e.g. 10am`}
                        value={dueTimeInput}
                        onChange={handleChangeDueTime}
                        error={dueTimeValidation.error}
                        helperText={dueTimeValidation.text}
                      />
                    </Grid>
                    <Grid item container justify={`flex-end`} spacing={1}>
                      <Grid item>
                        <Button
                          variant={`text`}
                          disabled={loading}
                          size={`small`}
                          onClick={handleCloseDueTime}
                        >{`Cancel`}</Button>
                      </Grid>

                      <Grid item>
                        <Button
                          variant={`contained`}
                          type={`submit`}
                          color={`primary`}
                          size={`small`}
                          disabled={
                            loading ||
                            dueTimeValidation.error ||
                            dueTime === null
                          }
                        >{`Add`}</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Popover>
              </Popover>
            </Grid>

            <Grid item>
              <Button
                variant={`outlined`}
                disabled={loading}
                startIcon={
                  formData.list === null ? (
                    <InboxOutlined />
                  ) : (
                    <FiberManualRecordIcon />
                  )
                }
                onClick={handleOpenList}
                style={{
                  color: formData.list?.color,
                  borderColor: formData.list?.color,
                }}
              >
                {formData.list === null ? `All` : formData.list.name}
              </Button>

              <Popover
                open={Boolean(listAnchorEl)}
                anchorEl={listAnchorEl}
                onClose={handleCloseList}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <List>
                  <ListItem onClick={() => handleChangeList(null)}>
                    <ListItemIcon>
                      <InboxOutlined />
                    </ListItemIcon>
                    <ListItemText primary={`All`} />
                  </ListItem>
                  {lists.map((list) => (
                    <ListItem
                      key={list._id}
                      onClick={() => handleChangeList(list)}
                      style={{
                        color: list.color,
                      }}
                    >
                      <ListItemIcon style={{ color: list.color }}>
                        <FiberManualRecordIcon color={`inherit`} />
                      </ListItemIcon>
                      <ListItemText
                        primary={list.name}
                        style={{ color: list.color }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            </Grid>

            <Grid item>
              <Button
                variant={`outlined`}
                disabled={loading}
                onClick={handleOpenPriority}
                style={{
                  color: formData.priority.color,
                  borderColor: formData.priority.color,
                }}
                startIcon={<FlagOutlined />}
              >
                {formData.priority.label}
              </Button>

              <Popover
                open={Boolean(priorityAnchorEl)}
                anchorEl={priorityAnchorEl}
                onClose={handleClosePriority}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <List>
                  {TodoPriorityOptions.map((priority) => (
                    <ListItem
                      key={priority.value}
                      onClick={() => handleChangePriority(priority)}
                    >
                      <ListItemIcon style={{ color: priority.color }}>
                        <FlagOutlined color={`inherit`} />
                      </ListItemIcon>
                      <ListItemText
                        primary={priority.label}
                        style={{ color: priority.color }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            </Grid>
          </Grid>

          <Grid item container justify={`flex-end`} spacing={1}>
            <Grid item>
              <Button
                variant={`text`}
                disabled={loading}
                onClick={handleCancel}
              >{`Cancel`}</Button>
            </Grid>

            <Grid item>
              <Button
                type={`submit`}
                variant={`contained`}
                color={`primary`}
                disabled={
                  loading ||
                  Object.values(validations).some((v) => v.error === true)
                }
              >{`Update`}</Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default UpdateTodoForm;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      width: '100%',
      margin: theme.spacing(1, 0, 0, 0),
    },
    timePanel: {
      padding: theme.spacing(1),
    },
    timePaper: {
      padding: theme.spacing(1),
    },
  }),
);
