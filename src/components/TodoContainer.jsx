import { useEffect, useState } from "react";
import {
  createTodo,
  deleteTodo,
  getTodoItem,
  getTodos,
  updateTodo,
} from "../api/todos";
import TodoList from "./TodoList";
import TodoInput from "./TodoInput";

const TodoContainer = () => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const data = await getTodos();

    setTodos(data);
  };

  const getTodoDetail = async (id) => {
    const data = await getTodoItem(id);

    alert(`Todo 상세 정보: ${JSON.stringify(data)}`);
  };

  const addTodo = async (todo) => {
    await createTodo(todo);

    await fetchTodos();
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);

    await fetchTodos();

    alert("Todo 삭제 완료");
  };

  const toggleTodo = async (todo) => {
    await updateTodo(todo);

    await fetchTodos();

    alert("Todo 업데이트 완료");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <TodoInput addTodo={addTodo} />
      <TodoList
        todos={todos}
        removeTodo={removeTodo}
        toggleTodo={toggleTodo}
        getTodoDetail={getTodoDetail}
      />
    </div>
  );
};

export default TodoContainer;
