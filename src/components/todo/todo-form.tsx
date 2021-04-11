import React from 'react';
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';


import { ITodo } from '@/typings';

export interface ITodoFormProps {
  type: 'update' | 'add';
  todo?: ITodo;
}

export default function TodoForm({ type, todo }: ITodoFormProps) {
  // const classes = useStyles();
  // const [addTodoData, setAddTodoData] = useState<ITodo>({
  //   name: '',
  //   due: '',
  //   dueDate: '',
  //   dueTime: '',
  //   priority: 4,
  //   position: null,
  //   completed: false
  // });
  // const [updateTodoData, setUpdateTodoData] = useState<ITodo>({
  //   name: todo?.name || '',
  //   due: todo?.due || '',
  //   dueDate: todo?.dueDate || '',
  //   dueTime: todo?.dueTime || '',
  //   priority: todo?.priority || 4,
  //   position: todo?.position || null,
  //   completed: todo?.completed || false
  // });
  
  const renderAddTodoForm = () => (
    <Card>
      <div>
        <Typography variant={`h4`}>Add Todo</Typography>
      </div>
      <CardContent>

      </CardContent>
    </Card>
  );

  const renderUpdateTodoForm = () => (
    <Card>
      <div>
        <Typography variant={`h4`}>Add Todo</Typography>
      </div>
      <CardContent>

      </CardContent>
    </Card>
  );

  return type === 'update' && todo ? renderUpdateTodoForm() : renderAddTodoForm();
}

// const useStyles = makeStyles(() => createStyles({}));
