import type { Task } from "../types/task";

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch("/api/tasks");

  if (!response.ok) {
    throw new Error("Ошибка загрузки задач");
  }

  return response.json();
};

export const createTaskRequest = async (task: Task): Promise<Task> => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Ошибка создания задачи");
  }

  return response.json();
};

export const updateTaskRequest = async (
  id: string,
  changes: Partial<Task>,
): Promise<Task> => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления задачи");
  }

  return response.json();
};
