import { Button, Card, Spin, Tag } from "antd";

import type { Task } from "../types/task";
import { useSettings } from "../hooks/useSettings";

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
    const {
        settings,
        isLoading,
    } = useSettings();

    if (isLoading || !settings) {
        return <Spin />;
    }

    const opacity = task.imageOpacity ?? 0.3;

    const backgroundImage = task.backgroundImage
        ? `
            linear-gradient(
                rgba(255, 255, 255, ${1 - opacity}),
                rgba(255, 255, 255, ${1 - opacity})
            ),
            url("${task.backgroundImage}")
        `
        : "none";

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
                backgroundColor:
                    task.backgroundColor ||
                    settings.backgroundColor,
                backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
                    color: settings.textColor,
                    fontSize:
                        settings.descriptionFontSize,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
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

            <div
                style={{
                    maxHeight: 55,
                    overflow: "hidden",
                }}
            >
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
                        onClick={() =>
                            onComplete(task.id)
                        }
                    >
                        Complete
                    </Button>
                </>
            )}

            {task.status === "deleted" && (
                <>
                    <Button
                        onClick={() =>
                            onRestore(task.id)
                        }
                    >
                        Restore
                    </Button>

                    {" "}

                    <Button
                        onClick={() =>
                            onComplete(task.id)
                        }
                    >
                        Complete
                    </Button>
                </>
            )}

            {task.status === "completed" && (
                <>
                    <Button
                        onClick={() =>
                            onRestore(task.id)
                        }
                    >
                        Restore
                    </Button>

                    {" "}

                    <Button
                        danger
                        onClick={() =>
                            onDelete(task.id)
                        }
                    >
                        Delete
                    </Button>
                </>
            )}
        </Card>
    );
};