import { todoClient } from "./client";

export const getTodos = async () => {
  const { data } = await todoClient.get("/todos");

  return data;
};

export const getTodoItem = async (id) => {
  const { data } = await todoClient.get(`/todos/${id}`);

  return data;
};

export const createTodo = async (todo) => {
  const response = await todoClient.post("/todos", todo);

  return response.data;
};

export const updateTodo = async (todo) => {
  const response = await todoClient.put(`/todos/${todo.id}`, todo);

  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await todoClient.delete(`/todos/${id}`);

  return response.data;
};
