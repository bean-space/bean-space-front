const TodoList = ({ todos, removeTodo, toggleTodo, getTodoDetail }) => {
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <p>id: {todo.id}</p>
            <p onClick={() => getTodoDetail(todo.id)}>title: {todo.title}</p>
            <p>userId: {todo.userId}</p>
            <p>completed: {todo.completed ? "true" : "false"}</p>

            <button
              onClick={() =>
                toggleTodo({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            >
              완료
            </button>
            <button onClick={() => removeTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
