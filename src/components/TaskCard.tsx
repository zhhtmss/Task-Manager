import { Button, Card, Tag } from "antd";

import type { Task } from "../types/task";
import { useSettings } from "../context/SettingsContext";

type Props = {
    task: Task;
    onDelete: (id: string) => void;
    onComplete: (id: string) => void;
    onRestore: (id: string) => void;
    onEdit: (task: Task) => void;
};

export const TaskCard = ({
    task,
    onDelete,
    onComplete,
    onRestore,
    onEdit,
}: Props) => {
    const { settings } = useSettings();

    return (
        <Card
            title={
                <span
                    style={{
                        fontSize: settings.titleFontSize,
                    }}
                >
                    {task.title}
                </span>
            }
            style={{
                width: settings.width,
                height: settings.height,
                background:
                    task.backgroundColor ||
                    settings.backgroundColor,
                color: settings.textColor,
                borderRadius: settings.borderRadius,
                overflow: "hidden",
            }}
            styles={{
                body: {
                    padding: settings.padding,
                },
            }}
        >
            <p
                style={{
                    fontSize: settings.descriptionFontSize,
                    color: settings.textColor,
                }}
            >
                {task.description}
            </p>

            <p>Created: {task.createdAt}</p>
            <p>Updated: {task.updatedAt}</p>
            <p>Status: {task.status}</p>

            {task.deletedAt && (
                <p>Deleted: {task.deletedAt}</p>
            )}

            {task.completedAt && (
                <p>Completed: {task.completedAt}</p>
            )}

            <div>
                {task.tags.map((tag) => (
                    <Tag key={tag.id}>
                        {tag.text}
                    </Tag>
                ))}
            </div>

            <br />

            <Button
                type="primary"
                onClick={() => onEdit(task)}
            >
                Edit
            </Button>

            {" "}

            {task.status === "active" && (
                <>
                    <Button
                        danger
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </Button>

                    {" "}

                    <Button
                        onClick={() => onComplete(task.id)}
                    >
                        Complete
                    </Button>
                </>
            )}

            {task.status === "deleted" && (
                <>
                    <Button
                        onClick={() => onRestore(task.id)}
                    >
                        Restore
                    </Button>

                    {" "}

                    <Button
                        onClick={() => onComplete(task.id)}
                    >
                        Complete
                    </Button>
                </>
            )}

            {task.status === "completed" && (
                <>
                    <Button
                        onClick={() => onRestore(task.id)}
                    >
                        Restore
                    </Button>

                    {" "}

                    <Button
                        danger
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </Button>
                </>
            )}
        </Card>
    );
};