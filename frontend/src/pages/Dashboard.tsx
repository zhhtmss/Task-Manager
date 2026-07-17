import { useState } from "react";
import { Button, Empty, Spin } from "antd";
import { PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { SearchBar, type SearchModes } from "../components/SearchBar";

import { TaskForm } from "../components/TaskForm";
import { TaskCard } from "../components/TaskCard";

import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";

export function Dashboard() {
    const [open, setOpen] = useState(false);

    const [editTask, setEditTask] =
        useState<Task | null>(null);

    const [currentSearch, setCurrentSearch] =
        useState("");

    const [archiveSearch, setArchiveSearch] =
        useState("");

    const [currentModes, setCurrentModes] =
        useState<SearchModes>({
            title: false,
            description: false,
            tags: false,
        });

    const [archiveModes, setArchiveModes] =
        useState<SearchModes>({
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
                .filter(
                    (tag) => tag.trim() !== ""
                )
                .map((tag) => ({
                    id: Math.random().toString(),
                    text: tag.trim(),
                })),

            createdAt:
                new Date().toLocaleString(),

            updatedAt:
                new Date().toLocaleString(),

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

            deletedAt:
                new Date().toLocaleString(),

            completedAt: undefined,

            updatedAt:
                new Date().toLocaleString(),
        });
    };

    const completeTask = async (id: string) => {
        await updateTaskRequest(id, {
            status: "completed",

            completedAt:
                new Date().toLocaleString(),

            deletedAt: undefined,

            updatedAt:
                new Date().toLocaleString(),
        });
    };

    const restoreTask = async (id: string) => {
        await updateTaskRequest(id, {
            status: "active",

            deletedAt: undefined,
            completedAt: undefined,

            updatedAt:
                new Date().toLocaleString(),
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
                .filter(
                    (tag) => tag.trim() !== ""
                )
                .map((tag) => ({
                    id: Math.random().toString(),
                    text: tag.trim(),
                })),

            backgroundColor,
            backgroundImage,
            imageOpacity,

            updatedAt:
                new Date().toLocaleString(),
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
        setModes: (
            modes: SearchModes
        ) => void,
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
        const searchText = search
            .toLowerCase()
            .trim();

        if (searchText === "") {
            return true;
        }

        const selectedModes =
            Object.values(modes).filter(
                (mode) => mode
            ).length;

        const searchEverywhere =
            selectedModes === 0 ||
            selectedModes === 3;

        const titleMatches = task.title
            .toLowerCase()
            .includes(searchText);

        const descriptionMatches =
            task.description
                .toLowerCase()
                .includes(searchText);

        const tagsMatch = task.tags.some(
            (tag) =>
                tag.text
                    .toLowerCase()
                    .includes(searchText)
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
            (
                modes.description &&
                descriptionMatches
            ) ||
            (modes.tags && tagsMatch)
        );
    };

    const currentTasks = tasks
        .filter(
            (task) =>
                task.status === "active"
        )
        .filter((task) =>
            filterTasks(
                task,
                currentSearch,
                currentModes
            )
        );

    const archiveTasks = tasks
        .filter(
            (task) =>
                task.status !== "active"
        )
        .filter((task) =>
            filterTasks(
                task,
                archiveSearch,
                archiveModes
            )
        );

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background:
                        "linear-gradient(135deg, #eef2ff, #f8fafc)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <Spin size="large" />

                    <p
                        style={{
                            marginTop: 15,
                            color: "#64748b",
                        }}
                    >
                        Loading tasks...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f8fafc",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        padding: 30,
                        borderRadius: 16,
                        textAlign: "center",
                        boxShadow:
                            "0 10px 30px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <h2>
                        Не удалось загрузить задачи
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        Проверь, запущен ли
                        Express-сервер.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "30px",
                background:
                    "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)",
            }}
        >
            {isFetching && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 18px",
                        backgroundColor:
                            "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        boxShadow:
                            "0 8px 25px rgba(0, 0, 0, 0.12)",
                    }}
                >
                    <Spin size="small" />

                    <span>
                        Updating tasks...
                    </span>
                </div>
            )}

            <div
                style={{
                    maxWidth: 1400,
                    margin: "0 auto",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 20,
                        flexWrap: "wrap",
                        marginBottom: 30,
                        padding: "24px 28px",
                        backgroundColor:
                            "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #e2e8f0",
                        borderRadius: 20,
                        boxShadow:
                            "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 34,
                                color: "#0f172a",
                            }}
                        >
                            📋 Task Manager
                        </h1>

                        <p
                            style={{
                                marginTop: 8,
                                marginBottom: 0,
                                color: "#64748b",
                            }}
                        >
                            Create, manage and
                            organize your tasks
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                        }}
                    >
                        <Link to="/settings">
                            <Button
                                size="large"
                                icon={
                                    <SettingOutlined />
                                }
                            >
                                Settings
                            </Button>
                        </Link>

                        <Button
                            type="primary"
                            size="large"
                            icon={
                                <PlusOutlined />
                            }
                            onClick={
                                openCreateForm
                            }
                        >
                            New Task
                        </Button>
                    </div>
                </header>

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

                <section
                    style={{
                        marginBottom: 35,
                        padding: 25,
                        backgroundColor:
                            "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #e2e8f0",
                        borderRadius: 20,
                        boxShadow:
                            "0 8px 25px rgba(15, 23, 42, 0.07)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            gap: 15,
                            marginBottom: 20,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    paddingLeft: 12,
                                    borderLeft:
                                        "5px solid #1677ff",
                                    color: "#0f172a",
                                }}
                            >
                                Current Tasks
                            </h2>

                            <p
                                style={{
                                    marginTop: 8,
                                    marginBottom: 0,
                                    color: "#64748b",
                                }}
                            >
                                Active tasks:{" "}
                                {
                                    currentTasks.length
                                }
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: 25,
                            padding: 18,
                            backgroundColor:
                                "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 14,
                        }}
                    >
                        <SearchBar
                            search={
                                currentSearch
                            }
                            modes={
                                currentModes
                            }
                            onSearchChange={
                                setCurrentSearch
                            }
                            onModeChange={(
                                name
                            ) =>
                                changeSearchMode(
                                    currentModes,
                                    setCurrentModes,
                                    name
                                )
                            }
                        />
                    </div>

                    {currentTasks.length ===
                    0 ? (
                        <Empty
                            description="No active tasks"
                            style={{
                                padding: 30,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            {currentTasks.map(
                                (task) => (
                                    <TaskCard
                                        key={
                                            task.id
                                        }
                                        task={
                                            task
                                        }
                                        onDelete={
                                            deleteTask
                                        }
                                        onComplete={
                                            completeTask
                                        }
                                        onRestore={
                                            restoreTask
                                        }
                                        onEdit={
                                            openEditForm
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>

                <section
                    style={{
                        padding: 25,
                        backgroundColor:
                            "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #e2e8f0",
                        borderRadius: 20,
                        boxShadow:
                            "0 8px 25px rgba(15, 23, 42, 0.07)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            gap: 15,
                            marginBottom: 20,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    paddingLeft: 12,
                                    borderLeft:
                                        "5px solid #ff4d4f",
                                    color: "#0f172a",
                                }}
                            >
                                Archive
                            </h2>

                            <p
                                style={{
                                    marginTop: 8,
                                    marginBottom: 0,
                                    color: "#64748b",
                                }}
                            >
                                Archived tasks:{" "}
                                {
                                    archiveTasks.length
                                }
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: 25,
                            padding: 18,
                            backgroundColor:
                                "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 14,
                        }}
                    >
                        <SearchBar
                            search={
                                archiveSearch
                            }
                            modes={
                                archiveModes
                            }
                            onSearchChange={
                                setArchiveSearch
                            }
                            onModeChange={(
                                name
                            ) =>
                                changeSearchMode(
                                    archiveModes,
                                    setArchiveModes,
                                    name
                                )
                            }
                        />
                    </div>

                    {archiveTasks.length ===
                    0 ? (
                        <Empty
                            description="Archive is empty"
                            style={{
                                padding: 30,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                gap: 20,
                                flexWrap: "wrap",
                            }}
                        >
                            {archiveTasks.map(
                                (task) => (
                                    <TaskCard
                                        key={
                                            task.id
                                        }
                                        task={
                                            task
                                        }
                                        onDelete={
                                            deleteTask
                                        }
                                        onComplete={
                                            completeTask
                                        }
                                        onRestore={
                                            restoreTask
                                        }
                                        onEdit={
                                            openEditForm
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}