import { FC, useState } from 'react';
import {
  Tooltip,
  IconButton,
  IconButtonProps,
  Popover,
  PopoverProps,
  List as MuiList,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Inbox as InboxIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import update from 'immutability-helper';

// Types
import { List } from '@/types/list';
import { Todo } from '@/types/todo';

// API
import api from '@/api';

// Custom Hooks
import { useList } from '@/hooks';

export interface TodoListPickerProps {
  todo: Todo;
  onFinishUpdateList: (todo: Todo) => Promise<void> | void;
}

const TodoListPicker: FC<TodoListPickerProps> = ({
  todo,
  onFinishUpdateList,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { lists } = useList();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpen: IconButtonProps['onClick'] = (e) => {
    if (!anchorEl) {
      setAnchorEl(e.currentTarget);
      return;
    }

    setAnchorEl(null);
  };

  const handleClose: PopoverProps['onClose'] = () => {
    setAnchorEl(null);
  };

  const handleUpdateList = async (newList: List | null) => {
    try {
      setLoading(true);

      const { data } = await api.patch(`/todos/list/${todo._id}`, {
        listId: newList !== null ? newList._id : null,
      });

      enqueueSnackbar(data.message, {
        variant: 'success',
        persist: false,
      });

      setLoading(false);
      setAnchorEl(null);

      onFinishUpdateList(
        update(data.todo, {
          due: {
            $set: moment(data.todo.due),
          },
        }),
      );
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

  const list: List | null =
    lists.filter((l) => l._id === todo.listId)[0] || null;

  return (
    <>
      <Tooltip
        title={list !== null ? list.name : `All`}
        aria-label={list !== null ? list.name : `All`}
      >
        <IconButton
          disabled={loading}
          onClick={handleOpen}
          style={{
            color: list !== null ? list.color : undefined,
          }}
        >
          {list !== null ? <FiberManualRecordIcon /> : <InboxIcon />}
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MuiList>
          <ListItem button onClick={() => handleUpdateList(null)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={`All`} />
          </ListItem>
          {lists.map((l) => (
            <ListItem key={l._id} button onClick={() => handleUpdateList(l)}>
              <ListItemIcon style={{ color: l.color }}>
                <FiberManualRecordIcon color={`inherit`} />
              </ListItemIcon>
              <ListItemText primary={l.name} style={{ color: l.color }} />
            </ListItem>
          ))}
        </MuiList>
      </Popover>
    </>
  );
};

export default TodoListPicker;
