import { useState } from "react";
import { Button, Spin } from "antd";
import { Link } from "react-router-dom";

import { SearchBar, type SearchModes } from "../components/SearchBar";

import { TaskForm } from "../components/TaskForm";
import { TaskCard } from "../components/TaskCard";

import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";

export function Dashboard() {
    const [open, setOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);

    const [currentSearch, setCurrentSearch] = useState("");
    const [archiveSearch, setArchiveSearch] = useState("");

    const [currentModes, setCurrentModes] = useState<SearchModes>({
        title: false,
        description: false,
        tags: false,
    });

    const [archiveModes, setArchiveModes] = useState<SearchModes>({
        title: false,
        description: false,
        tags: false,
    });

    const {
        tasks,
        isLoading,
        isFetching,
        error,
        createTask: createTaskRequest,
        updateTask: updateTaskRequest,
    } = useTasks();

    const createTask = async (
        title: string,
        description: string,
        tags: string,
        backgroundColor: string,
        backgroundImage: string,
        imageOpacity: number
    ) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            description,

            tags: tags
                .split(",")
                .filter((tag) => tag.trim() !== "")
                .map((tag) => ({
                    id: Math.random().toString(),
                    text: tag.trim(),
                })),

            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),

            status: "active",
            backgroundColor,
            backgroundImage,
            imageOpacity,
        };

        await createTaskRequest(newTask);

        setOpen(false);
    };

    const deleteTask = async (id: string) => {
        await updateTaskRequest(id, {
            status: "deleted",
            deletedAt: new Date().toLocaleString(),
            completedAt: undefined,
            updatedAt: new Date().toLocaleString(),
        });
    };

    const completeTask = async (id: string) => {
        await updateTaskRequest(id, {
            status: "completed",
            completedAt: new Date().toLocaleString(),
            deletedAt: undefined,
            updatedAt: new Date().toLocaleString(),
        });
    };

    const restoreTask = async (id: string) => {
        await updateTaskRequest(id, {
            status: "active",
            deletedAt: undefined,
            completedAt: undefined,
            updatedAt: new Date().toLocaleString(),
        });
    };

    const updateTask = async (
        title: string,
        description: string,
        tags: string,
        backgroundColor: string,
        backgroundImage: string,
        imageOpacity: number
    ) => {
        if (!editTask) {
            return;
        }

        await updateTaskRequest(editTask.id, {
            title,
            description,

            tags: tags
                .split(",")
                .filter((tag) => tag.trim() !== "")
                .map((tag) => ({
                    id: Math.random().toString(),
                    text: tag.trim(),
                })),

            backgroundColor,
            backgroundImage,
            imageOpacity,
            updatedAt: new Date().toLocaleString(),
        });

        setEditTask(null);
        setOpen(false);
    };

    const openCreateForm = () => {
        setEditTask(null);
        setOpen(true);
    };

    const openEditForm = (task: Task) => {
        setEditTask(task);
        setOpen(true);
    };

    const closeForm = () => {
        setOpen(false);
        setEditTask(null);
    };

    const changeSearchMode = (
        modes: SearchModes,
        setModes: (modes: SearchModes) => void,
        name: keyof SearchModes
    ) => {
        setModes({
            ...modes,
            [name]: !modes[name],
        });
    };

    const filterTasks = (
        task: Task,
        search: string,
        modes: SearchModes
    ) => {
        const searchText = search.toLowerCase().trim();

        if (searchText === "") {
            return true;
        }

        const selectedModes = Object.values(modes).filter(
            (mode) => mode
        ).length;

        const searchEverywhere =
            selectedModes === 0 || selectedModes === 3;

        const titleMatches = task.title
            .toLowerCase()
            .includes(searchText);

        const descriptionMatches = task.description
            .toLowerCase()
            .includes(searchText);

        const tagsMatch = task.tags.some((tag) =>
            tag.text.toLowerCase().includes(searchText)
        );

        if (searchEverywhere) {
            return (
                titleMatches ||
                descriptionMatches ||
                tagsMatch
            );
        }

        return (
            (modes.title && titleMatches) ||
            (modes.description && descriptionMatches) ||
            (modes.tags && tagsMatch)
        );
    };

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 20 }}>
                <h2>Не удалось загрузить задачи</h2>
                <p>Проверь, запущен ли Express-сервер.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            {isFetching && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        zIndex: 1000,
                        padding: "12px 18px",
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        boxShadow: "0 2px 10px #cccccc",
                    }}
                >
                    Updating tasks...
                </div>
            )}

            <h1>Dashboard</h1>

            <Link to="/settings">
                <Button>Settings</Button>
            </Link>

            {" "}

            <Button
                type="primary"
                onClick={openCreateForm}
            >
                New Task
            </Button>

            <TaskForm
                open={open}
                task={editTask}
                onClose={closeForm}
                onCreate={
                    editTask
                        ? updateTask
                        : createTask
                }
            />

            <h2>Current</h2>

            <SearchBar
                search={currentSearch}
                modes={currentModes}
                onSearchChange={setCurrentSearch}
                onModeChange={(name) =>
                    changeSearchMode(
                        currentModes,
                        setCurrentModes,
                        name
                    )
                }
            />

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                {tasks
                    .filter(
                        (task) => task.status === "active"
                    )
                    .filter((task) =>
                        filterTasks(
                            task,
                            currentSearch,
                            currentModes
                        )
                    )
                    .map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onComplete={completeTask}
                            onRestore={restoreTask}
                            onEdit={openEditForm}
                        />
                    ))}
            </div>

            <hr style={{ margin: "30px 0" }} />

            <h2>Archive</h2>

            <SearchBar
                search={archiveSearch}
                modes={archiveModes}
                onSearchChange={setArchiveSearch}
                onModeChange={(name) =>
                    changeSearchMode(
                        archiveModes,
                        setArchiveModes,
                        name
                    )
                }
            />

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                {tasks
                    .filter(
                        (task) => task.status !== "active"
                    )
                    .filter((task) =>
                        filterTasks(
                            task,
                            archiveSearch,
                            archiveModes
                        )
                    )
                    .map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onComplete={completeTask}
                            onRestore={restoreTask}
                            onEdit={openEditForm}
                        />
                    ))}
            </div>
        </div>
    );
}