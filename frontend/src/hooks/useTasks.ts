import { useQuery } from "@tanstack/react-query";

import { createTaskRequest, getTasks, updateTaskRequest } from "../api/tasks";

import type { Task } from "../types/task";

export const useTasks = () => {
    const tasksQuery = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
    });

    const createTask = async (task: Task) => {
        await createTaskRequest(task);
        await tasksQuery.refetch();
    };

    const updateTask = async (
        id: string,
        changes: Partial<Task>
    ) => {
        await updateTaskRequest(id, changes);
        await tasksQuery.refetch();
    };

    return {
        tasks: tasksQuery.data || [],
        isLoading: tasksQuery.isLoading,
        isFetching: tasksQuery.isFetching,
        error: tasksQuery.error,
        createTask,
        updateTask,
    };
};