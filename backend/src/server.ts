import express from "express";
import dotenv from "dotenv";
import fs from "node:fs";

dotenv.config();

type Tag = {
    id: string;
    text: string;
};

type TaskStatus = "active" | "completed" | "deleted";

type Task = {
    id: string;
    title: string;
    description: string;
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    deletedAt?: string;
    status: TaskStatus;
    backgroundColor?: string;
    backgroundImage?: string;
    imageOpacity?: number;
};

type TaskChanges = Partial<Omit<Task, "id" | "createdAt">>;

type CardSettings = {
    backgroundColor: string;
    textColor: string;
    padding: number;
    borderRadius: number;
    width: number;
    height: number;
    titleFontSize: number;
    descriptionFontSize: number;
};

const settingsFilePath = "./data/settings.json";

const readSettings = (): CardSettings => {
    const data = fs.readFileSync(settingsFilePath, "utf8");

    return JSON.parse(data) as CardSettings;
};

const writeSettings = (settings: CardSettings) => {
    fs.writeFileSync(
        settingsFilePath,
        JSON.stringify(settings, null, 4)
    );
};

const app = express();

app.use(
    express.json({
        limit: "10mb"
    })
);

const PORT = Number(process.env.PORT) || 5000;
const DELAY = Number(process.env.DELAY) || 0;

const filePath = "./data/tasks.json";

const readTasks = (): Task[] => {
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data) as Task[];
};

const writeTasks = (tasks: Task[]) => {
    fs.writeFileSync(
        filePath,
        JSON.stringify(tasks, null, 4)
    );
};

const sendWithDelay = (
    callback: () => void
) => {
    setTimeout(callback, DELAY);
};

app.get("/api/tasks", (_request, response) => {
    sendWithDelay(() => {
        response.json(readTasks());
    });
});

app.post("/api/tasks", (request, response) => {
    const tasks = readTasks();
    const newTask = request.body as Task;

    tasks.push(newTask);
    writeTasks(tasks);

    sendWithDelay(() => {
        response.status(201).json(newTask);
    });
});

app.patch("/api/tasks/:id", (request, response) => {
    const tasks = readTasks();
    const changes = request.body as TaskChanges;

    const taskIndex = tasks.findIndex(
        task => task.id === request.params.id
    );

    if (taskIndex === -1) {
        sendWithDelay(() => {
            response.status(404).json({
                message: "Task not found",
            });
        });

        return;
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...changes,
    };

    writeTasks(tasks);

    sendWithDelay(() => {
        response.json(tasks[taskIndex]);
    });
});

app.get("/api/settings", (_request, response) => {
    sendWithDelay(() => {
        response.json(readSettings());
    });
});

app.patch("/api/settings", (request, response) => {
    const settings = readSettings();

    const updatedSettings = {
        ...settings,
        ...request.body,
    };

    writeSettings(updatedSettings);

    sendWithDelay(() => {
        response.json(updatedSettings);
    });
});

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});