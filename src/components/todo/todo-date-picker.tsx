import React, { useState, useEffect, MouseEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Popover, Tooltip, CardActions } from '@material-ui/core';
import { Today as TodayIcon } from '@material-ui/icons';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Calendar } from '@material-ui/pickers';
import { red, green, orange, purple } from '@material-ui/core/colors';
import moment, { Moment } from 'moment';
import clsx from 'clsx';

// Types
import { ITodo } from '@/typings';

export interface ITodoDatePickerProps {
  todo: ITodo;
  onChange: (date: MaterialUiPickersDate) => void | Promise<void>;
}

export default function TodoDatePicker({
  todo,
  onChange,
}: ITodoDatePickerProps) {
  const classes = useStyles();
  const [
    datePickerAnchorEl,
    setDatePickerAnchorEl,
  ] = useState<HTMLButtonElement | null>(null);
  const [tooltipText, setTooltipText] = useState<string>('');
  const [dateHeadline, setDateHeadline] = useState<string | null>(null);
  const showDatePicker = Boolean(datePickerAnchorEl);

  useEffect(() => {
    const todoDue: Moment = todo.due as Moment;

    setTooltipText(todoDue.format('dddd, MMMM Do YYYY'));

    if (todoDue.isSame(moment().subtract(1, 'day'), 'day')) {
      setDateHeadline('Yesterday');
    } else if (todoDue.isSame(moment(), 'day')) {
      setDateHeadline('Today');
    } else if (todoDue.isSame(moment().add(1, 'day'), 'day')) {
      setDateHeadline('Tomorrow');
    } else {
      setDateHeadline(todoDue.format('MMM Do YYYY'));
    }
  }, [todo.due]);

  const handleShowDatePicker = (e: MouseEvent<HTMLButtonElement>): void => {
    setDatePickerAnchorEl(e.currentTarget);
  };

  const handleHideDatePicker = (): void => {
    setDatePickerAnchorEl(null);
  };

  const onChangeDueDate = (
    date: MaterialUiPickersDate,
    isFinish?: boolean,
  ): void => {
    if (!isFinish) {
      return;
    }

    onChange(date);
    handleHideDatePicker();
  };

  return (
    <div className={classes.wrapper}>
      <Tooltip arrow title={tooltipText}>
        <Button
          className={clsx({
            [classes.overdueButton]: moment(todo.due).isBefore(moment(), 'day'),
            [classes.todayButton]: moment(todo.due).isSame(moment(), 'day'),
            [classes.tomorrowButton]: moment(todo.due).isSame(
              moment().add(1, 'day'),
              'day',
            ),
            [classes.sameWeekButton]:
              !moment(todo.due).isBefore(moment(), 'day') &&
              !moment(todo.due).isSame(moment(), 'day') &&
              !moment(todo.due).isSame(moment().add(1, 'day'), 'day') &&
              moment(todo.due).isSame(moment(), 'week'),
          })}
          onClick={handleShowDatePicker}
          startIcon={<TodayIcon />}
          size={`small`}
        >
          {dateHeadline}
        </Button>
      </Tooltip>

      <Popover
        open={showDatePicker}
        anchorEl={datePickerAnchorEl}
        onClose={handleHideDatePicker}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Calendar
          date={
            (todo.due as Moment).isBefore(moment(), 'day')
              ? moment()
              : (todo.due as Moment)
          }
          onChange={onChangeDueDate}
          minDate={moment()}
        />
      </Popover>
    </div>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
    },
    overdueButton: {
      color: red[500],
    },
    todayButton: {
      color: green[500],
    },
    tomorrowButton: {
      color: orange[500],
    },
    sameWeekButton: {
      color: purple[500],
    },
  }),
);
