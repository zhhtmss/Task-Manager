import { useState } from "react";
import { Button } from "antd";

import { SearchBar}  from "../components/SearchBar";
import { TaskForm } from "../components/TaskForm";
import { TaskCard } from "../components/TaskCard";

import { tasks as initialTasks } from "../data/tasks";
import type { Task } from "../types/task";

export function Dashboard() {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const createTask = (
        title: string,
        description: string,
        tags: string
    ) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            description,
            tags: tags.split(",").map(tag => ({ id: Math.random().toString(), text: tag.trim() })),

            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
            status: "active",
            backgroundColor: "#ffffff",
        };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id:string) => {
        setTasks(
            tasks.map(task => {
                if ( task.id === id) {
                    return{
                        ...task,
                        status:"deleted",
                        updatedAt: new Date().toLocaleString(),
                    };
                }
                return task;
            })
        )
    }

    const restoreTask = (id:string) => {
        setTasks(
            tasks.map(task =>{
                if (task.id === id) {
                    return {
                        ...task,
                        status: "active",
                        updatedAt: new Date().toLocaleString(),
                    };
                }
                return task;
            })
        )
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>

            <Button
                type="primary"
                onClick={() => setOpen(true)}
            >
                New Task
            </Button>

            <TaskForm
                open={open}
                onClose={() => setOpen(false)}
                onCreate={createTask}
            />

            <br />
            <br />

            <h2>Current</h2>

            <SearchBar />

            <br />

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                {tasks
                    .filter(task => task.status === "active")
                    .map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onRestore={restoreTask}
                        />
                    ))}
            </div>

            <hr />

            <h2>Archive</h2>

            <SearchBar />

            <br />

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    flexWrap: "wrap",
                }}
            >
                {tasks
                    .filter(task => task.status !== "active")
                    .map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onRestore={restoreTask}
                        />
                    ))}
            </div>
        </div>
    );
}