import { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { Link } from "react-router-dom";

import { SearchBar, type SearchModes } from "../components/SearchBar";
import { TaskForm } from "../components/TaskForm";
import { TaskCard } from "../components/TaskCard";

import { tasks as initialTasks } from "../data/tasks";
import type { Task } from "../types/task";

export function Dashboard() {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [currentSearch, setCurrentSearch] = useState("");
    const [archiveSearch, setArchiveSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const [currentModes, setCurrentModes] = useState({
        title: false,
        description: false,
        tags: false,
    });
    
    const [archiveModes, setArchiveModes] = useState({
        title: false,
        description: false,
        tags: false,
    });

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
        const text = search.toLowerCase().trim();

        if (text === "") {
            return true;
        }

        const selectedCount = Object.values(modes).filter(Boolean).length;

        const searchEverywhere =
            selectedCount === 0 || selectedCount === 3;

        const titleMatches =
            task.title.toLowerCase().includes(text);

        const descriptionMatches =
            task.description.toLowerCase().includes(text);

        const tagsMatch = task.tags.some((tag) =>
            tag.text.toLowerCase().includes(text)
        );

        if (searchEverywhere) {
            return titleMatches || descriptionMatches || tagsMatch;
        }

        return (
            (modes.title && titleMatches) ||
            (modes.description && descriptionMatches) ||
            (modes.tags && tagsMatch)
        );
    };

    const createTask = (
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

        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id: string) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    return {
                        ...task,
                        status: "deleted",
                        deletedAt: new Date().toLocaleString(),
                        completedAt: undefined,
                        updatedAt: new Date().toLocaleString(),
                    };
                }

                return task;
            })
        );
    };

    const completeTask = (id: string) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    return {
                        ...task,
                        status: "completed",
                        completedAt: new Date().toLocaleString(),
                        deletedAt: undefined,
                        updatedAt: new Date().toLocaleString(),
                    };
                }

                return task;
            })
        );
    };

    const restoreTask = (id: string) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    return {
                        ...task,
                        status: "active",
                        deletedAt: undefined,
                        completedAt: undefined,
                        updatedAt: new Date().toLocaleString(),
                    };
                }

                return task;
            })
        );
    };

    const updateTask = (
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

        setTasks(
            tasks.map((task) => {
                if (task.id === editTask.id) {
                    return {
                        ...task,
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
                    };
                }

                return task;
            })
        );

        setEditTask(null);
        setOpen(false);
    };
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (!loading) {
            setRefreshing(true);

            message.loading("Updating tasks...", 1);

            setTimeout(() => {
                setRefreshing(false);
            }, 1000);
        }
    }, [loading]);

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


    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>
            <Link to="/settings">
                <Button>Settings</Button>
            </Link>

            <Button
                type="primary"
                onClick={openCreateForm}
            >
                New Task
            </Button>

            <TaskForm
                open={open}
                onClose={closeForm}
                onCreate={editTask ? updateTask : createTask}
                task={editTask}
            />

            <br />
            <br />

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

            <br />

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                {tasks
                    .filter((task) => task.status === "active")
                    .filter((task) =>
                        filterTasks(task, currentSearch, currentModes)
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

            <hr />

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

            <br />

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                {tasks
                    .filter((task) => task.status !== "active")
                    .filter((task) =>
                        filterTasks(task, archiveSearch, archiveModes)
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