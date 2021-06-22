import { FC, useState, FormEvent, MouseEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Grid,
  IconButton,
  Button,
  TextField,
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
} from '@material-ui/icons';
import moment, { Moment } from 'moment';
import update from 'immutability-helper';

// API
import api from '@/api';

// Types
import { AddTodoFormValidation, AddTodoFormData } from '@/types/todo';

// Constants
import { TodoPriorityOptions } from '@/constants/todo';

// Custom Hooks
import { useList } from '@/hooks';

// Utils
import { TodoValidator } from '@/utils/validator';

const AddTodoForm: FC<{}> = () => {
  const classes = useStyles();
  const { lists } = useList();
  const [open, setOpen] = useState<boolean>(false);
  const [dueAnchorEl, setDueAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [dueTimeAnchorEl, setDueTimeAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [listAnchorEl, setListAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [priorityAnchorEl, setPriorityAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [validations, setValidations] = useState<AddTodoFormValidation>({
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
  const [formData, setFormData] = useState<AddTodoFormData>({
    list: null,
    name: '',
    notes: null,
    url: null,
    isDateSet: true,
    isTimeSet: false,
    due: moment(),
    priority: TodoPriorityOptions[0],
  });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDue = (e: MouseEvent<HTMLButtonElement>) => {
    setDueAnchorEl(e.currentTarget);
  };
  const handleCloseDue = () => {
    setDueAnchorEl(null);
  };
  const handleOpenDueTime = (e: MouseEvent<HTMLButtonElement>) => {
    setDueTimeAnchorEl(e.currentTarget);
  };
  const handleCloseDueTime = () => {
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

  const handleChangeList = (list: AddTodoFormData['list']) => {
    setFormData(
      update(formData, {
        list: {
          $set: list,
        },
      }),
    );
    setListAnchorEl(null);
  };

  const handleChangePriority = (priority: AddTodoFormData['priority']) => {
    setFormData(
      update(formData, {
        priority: {
          $set: priority,
        },
      }),
    );
    setPriorityAnchorEl(null);
  };

  const handleAddTodo = async (e: FormEvent) => {
    try {
      e.preventDefault();
    } catch (err) {}
  };

  return (
    <>
      {!open && (
        <Button
          fullWidth
          variant={`text`}
          startIcon={<AddOutlined />}
          onClick={handleOpen}
        >{`Add Todo`}</Button>
      )}

      {open && (
        <Grid
          className={classes.wrapper}
          container
          component={`form`}
          onSubmit={handleAddTodo}
          direction={`column`}
          spacing={1}
        >
          {/* Todo Name */}
          <Grid item>
            <TextField
              fullWidth
              variant={`outlined`}
              multiline
              placeholder={`e.g. Study Calculus.`}
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
                  {formData.isTimeSet ? (
                    <Button
                      variant={`text`}
                      startIcon={<AddOutlined />}
                      onClick={handleOpenDueTime}
                    >{`Add Time`}</Button>
                  ) : (
                    <Button
                      variant={`text`}
                      startIcon={<AddOutlined />}
                      onClick={handleOpenDueTime}
                    >{`Add Time`}</Button>
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
                  <Grid container direction={`column`} spacing={1}>
                    <Grid item>
                      <TextField
                        fullWidth
                        size={`small`}
                        label={`Time`}
                        placeholder={`e.g. 10am`}
                      />
                    </Grid>
                    <Grid item container justify={`flex-end`} spacing={1}>
                      <Grid item>
                        <Button
                          variant={`text`}
                          size={`small`}
                          onClick={handleCloseDueTime}
                        >{`Cancel`}</Button>
                      </Grid>

                      <Grid item>
                        <Button
                          variant={`contained`}
                          color={`primary`}
                          size={`small`}
                          disabled={Object.values(validations).some(
                            (v) => v.error === true,
                          )}
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
              <Button variant={`text`} onClick={handleClose}>{`Cancel`}</Button>
            </Grid>

            <Grid item>
              <Button
                type={`submit`}
                variant={`contained`}
                color={`primary`}
                disabled={Object.values(validations).some(
                  (v) => v.error === true,
                )}
              >{`Add`}</Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AddTodoForm;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      width: '100%',
    },
    timePanel: {
      padding: theme.spacing(1),
    },
    timePaper: {
      padding: theme.spacing(1),
    },
  }),
);
