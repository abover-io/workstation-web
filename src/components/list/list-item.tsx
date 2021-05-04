import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Paper,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@material-ui/core';
import {
  ArrowForwardIos as ArrowForwardIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from '@material-ui/icons';

// Types
import { IList } from '@/types/list';

export interface IListItemProps {
  list: IList;
}

const ListItem: FC<IListItemProps> = ({ list }: IListItemProps) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <MuiListItem
      component={Paper}
      button
      variant={`outlined`}
      onClick={() =>
        router.push({
          pathname: `/lists/${list._id}`,
        })
      }
    >
      <ListItemIcon>
        <Avatar
          className={classes.circle}
          style={{ backgroundColor: list.color }}
        >
          <FormatListBulletedIcon fontSize={`small`} />
        </Avatar>
      </ListItemIcon>

      <ListItemText primary={list.name} />
      <ArrowForwardIcon />
    </MuiListItem>
  );
};

export default ListItem;

const useStyles = makeStyles((theme) =>
  createStyles({
    circle: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
  }),
);
