import { Card, Tag, Button } from "antd";
import type { Task } from "../types/task";

type Props ={
    task: Task;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
};

export const TaskCard = ({ task, onDelete, onRestore }: Props) => {
    return (
        <Card
            title={task.title}
            style={{
                width: 320,
                background: task.backgroundColor,
            }}
        >
            <p>{task.description}</p>

            <p>Created: {task.createdAt}</p>
            <p>Updated: {task.updatedAt}</p>
            
            <div>
                {task.tags.map((tag) => (
                    <Tag key={tag.id}>
                        {tag.text}
                    </Tag>
                ))}
            </div>
            <br />

            <Button type="primary">
                Edit
            </Button>

            {task.status === "active" ? (
                <Button
                    danger
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </Button>
            ) : (
                <Button
                    onClick={() => onRestore(task.id)}
                >
                    Restore
                </Button>
            )}
        </Card>
    );
};
