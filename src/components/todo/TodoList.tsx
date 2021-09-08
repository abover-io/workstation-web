import { FC, useState } from 'react';
import {
  List as MuiList,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

// Types
import { List } from '@/types/list';
import { Todo } from '@/types/todo';

// Components
import TodoItem from './todo-item';
import AddTodoForm, { AddTodoFormProps } from './add-todo-form';

export interface TodoListProps {
  todos: Todo[];
  onFinishAdd: AddTodoFormProps['onFinish'];
  list?: List;
}

const TodoList: FC<TodoListProps> = ({ todos, onFinishAdd, list }) => {
  const [addOpen, setAddOpen] = useState<boolean>(false);

  const handleOpenAddForm = () => {
    setAddOpen(true);
  };
  const handleCloseAddForm = () => {
    setAddOpen(false);
  };

  return (
    <MuiList disablePadding>
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
      <AddTodoForm
        open={addOpen}
        overlay={
          <ListItem disableGutters button onClick={handleOpenAddForm}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={`Add Todo`} />
          </ListItem>
        }
        onClose={handleCloseAddForm}
        onFinish={onFinishAdd}
        defaultTodo={{
          list,
        }}
      />
    </MuiList>
  );
};

export default TodoList;
