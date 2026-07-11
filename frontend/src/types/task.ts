export type Tag = {
    id: string,
    text: string,
    color?: string;
}
export type TaskStatus = "active" | "completed" | "deleted";

export type Task = {
    id: string, 
    title: string,
    description: string,
    tags: Tag[],
    createdAt: string,
    updatedAt: string,
    completedAt?: string,
    deletedAt?: string,
    status: TaskStatus,
    backgroundColor?: string,
    backgroundImage?: string,
    imageOpacity?: number,
    backgroundSize?: string,
    backgroundPosition?: string;
}