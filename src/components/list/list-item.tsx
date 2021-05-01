import React, { FC } from 'react';
import { useRouter } from 'next/router';
import {
  Paper,
  ListItem as MuiListItem,
  ListItemText,
} from '@material-ui/core';
import { ArrowForwardIos as ArrowForwardIcon } from '@material-ui/icons';

// Types
import { IList } from '@/types/list';

export interface IListItemProps {
  list: IList;
}

const ListItem: FC<IListItemProps> = ({ list }: IListItemProps) => {
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
      <ListItemText primary={list.name} />
      <ArrowForwardIcon />
    </MuiListItem>
  );
};

export default ListItem;
