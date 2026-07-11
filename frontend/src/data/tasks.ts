import type { Task } from "../types/task";

export const tasks: Task[] = [
    {
        id: "1",
        title: "Learn React",
        description: "Finish hooks lesson",
        tags: [
            {
                id: "1",
                text: "React",
            },
            {
                id: "2",
                text: "Study",
            },
        ],
        createdAt: "",
        updatedAt: "",
        status: "active",
    },
    {
        id: "2",
        title: "Buy food",
        description: "Milk and bread",
        tags: [
            {
                id: "3",
                text: "Home",
            },
        ],
        createdAt: "",
        updatedAt: "",
        status: "deleted",
    },
];