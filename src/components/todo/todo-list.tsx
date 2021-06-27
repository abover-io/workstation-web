import { FC, useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';

// Types
import { Todo } from '@/types/todo';

// Components
import TodoItem from './todo-item';
import AddTodoForm, { AddTodoFormProps } from './add-todo-form';

export interface TodoListProps {
  todos: Todo[];
  onFinishAdd: AddTodoFormProps['onFinish'];
}

const TodoList: FC<TodoListProps> = ({ todos, onFinishAdd }) => {
  const [addOpen, setAddOpen] = useState<boolean>(false);

  const handleOpenAddForm = () => {
    setAddOpen(true);
  };
  const handleCloseAddForm = () => {
    setAddOpen(false);
  };

  return (
    <List disablePadding>
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
      <AddTodoForm
        open={addOpen}
        overlay={
          <ListItem disableGutters button onClick={handleOpenAddForm}>
            <ListItemIcon>
              <AddOutlined />
            </ListItemIcon>
            <ListItemText primary={`Add Todo`} />
          </ListItem>
        }
        onClose={handleCloseAddForm}
        onFinish={onFinishAdd}
      />
    </List>
  );
};

export default TodoList;
