import React, {
  useState,
  useEffect,
  MouseEvent,
  FormEvent,
  ChangeEvent,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CardActions, Button, Popover, TextField } from '@material-ui/core';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import { Moment } from 'moment';

// Types
import { ITodo, ITodoValidations } from '@/typings';

export interface ITodoTimeFormProps {
  todo: ITodo;
  todoErrors: ITodoValidations;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onComplete: () => void;
  clearForm: () => void;
  mode: 'add' | 'update' | 'show';
  modeHandler: (mode: 'add' | 'update' | 'show') => void;
  statusHandler: (status: 'set' | 'unset') => void;
}

export default function TodoTimeForm({
  todo,
  todoErrors,
  onChange,
  onComplete,
  clearForm,
  // mode,
  // modeHandler,
  statusHandler,
}: ITodoTimeFormProps) {
  const classes = useStyles();
  const [
    timeFormAnchorEl,
    setTimeFormAnchorEl,
  ] = useState<HTMLButtonElement | null>(null);
  // const [tooltipText, setTooltipText] = useState<string>('');
  const [status, setStatus] = useState<'set' | 'unset'>('unset');
  const [timeHeadline, setTimeHeadline] = useState<string | null>(null);
  const showTimeForm = Boolean(timeFormAnchorEl);

  useEffect(() => {
    const todoDue: Moment = todo.due as Moment;

    if (todo.isTimeSet === false) {
      setStatus('unset');
    } else if (todo.isTimeSet === true) {
      setStatus('set');
    }

    setTimeHeadline(todoDue.format('hh:mm A'));
  }, [todo]);

  const handleShowTimeForm = (e: MouseEvent<HTMLButtonElement>): void => {
    setTimeFormAnchorEl(e.currentTarget);

    // if (mode === 'show') {
    //   modeHandler('update');
    // }
  };

  const handleHideTimeForm = (): void => {
    setTimeFormAnchorEl(null);

    if (status === 'unset') {
      clearForm();
    }
  };

  const handleOnComplete = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();

    if (todoErrors.dueTime !== null && todoErrors.dueTime.length > 0) {
      return;
    } else {
      if (!todo.dueTime || todo.dueTime.length <= 0) {
        handleHideTimeForm();
        clearForm();
        statusHandler('unset');
      } else {
        handleHideTimeForm();
        onComplete();
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      {status === 'set' ? (
        <Button
          onClick={handleShowTimeForm}
          startIcon={<AccessTimeIcon />}
          size={`small`}
        >
          {timeHeadline}
        </Button>
      ) : status === 'unset' ? (
        <Button onClick={handleShowTimeForm} size={`small`}>
          + Add Time
        </Button>
      ) : (
        ''
      )}

      <Popover
        open={showTimeForm}
        anchorEl={timeFormAnchorEl}
        onClose={handleHideTimeForm}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <form className={classes.timeForm} onSubmit={handleOnComplete}>
          <TextField
            autoFocus
            placeholder={`e.g. 5am`}
            value={todo.dueTime || ''}
            onChange={onChange}
            error={todoErrors.dueTime !== null && todoErrors.dueTime.length > 0}
            helperText={todoErrors.dueTime}
          />
        </form>

        {status === 'unset' ? (
          <CardActions classes={{ root: classes.cardActions }}>
            <Button
              variant={`contained`}
              color={`primary`}
              onClick={handleOnComplete}
              size={`small`}
              disabled={
                todoErrors.dueTime !== null && todoErrors.dueTime.length > 0
              }
            >
              Add
            </Button>

            <Button
              color={`secondary`}
              onClick={handleHideTimeForm}
              size={`small`}
            >
              Cancel
            </Button>
          </CardActions>
        ) : status === 'set' ? (
          <CardActions classes={{ root: classes.cardActions }}>
            <Button
              variant={`contained`}
              color={`primary`}
              onClick={handleOnComplete}
              size={`small`}
              disabled={
                todoErrors.dueTime !== null && todoErrors.dueTime.length > 0
              }
            >
              Update
            </Button>

            <Button
              color={`secondary`}
              onClick={handleHideTimeForm}
              size={`small`}
            >
              Cancel
            </Button>
          </CardActions>
        ) : (
          ''
        )}
      </Popover>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
    },
    timeForm: {
      padding: theme.spacing(1, 2),
    },
    cardActions: {
      padding: theme.spacing(1, 2),
    },
  }),
);
