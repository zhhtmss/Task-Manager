import { Button, Card, Spin, Tag } from "antd";

import { CheckOutlined, DeleteOutlined, EditOutlined, RollbackOutlined } from "@ant-design/icons";

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

    const statusColor = () => {
        if (task.status === "active") {
            return "green";
        }

        if (task.status === "completed") {
            return "blue";
        }

        return "red";
    };

    return (
        <Card
            title={
                <span
                    style={{
                        fontSize: settings.titleFontSize,
                        fontWeight: 700,
                        color: settings.textColor,
                    }}
                >
                    {task.title}
                </span>
            }
            style={{
                width: settings.width,

                minHeight: settings.height,
                height: "auto",

                backgroundColor:
                    task.backgroundColor ||
                    settings.backgroundColor,

                backgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",

                color: settings.textColor,
                borderRadius: settings.borderRadius,

                overflow: "visible",

                boxShadow:
                    "0 8px 24px rgba(15, 23, 42, 0.10)",

                border:
                    task.status === "deleted"
                        ? "1px solid #ffb3b3"
                        : "1px solid #dbeafe",
            }}
            styles={{
                body: {
                    padding: settings.padding,

                    display: "flex",
                    flexDirection: "column",
                    gap: 10,

                    overflow: "visible",
                },

                header: {
                    backgroundColor:
                        "rgba(255, 255, 255, 0.25)",
                },
            }}
        >
            <p
                style={{
                    margin: 0,
                    color: settings.textColor,
                    fontSize:
                        settings.descriptionFontSize,

                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                }}
            >
                {task.description}
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontSize: 14,
                    color: settings.textColor,
                }}
            >
                <span>
                    Created: {task.createdAt}
                </span>

                <span>
                    Updated: {task.updatedAt}
                </span>

                <span>
                    Status:{" "}

                    <Tag color={statusColor()}>
                        {task.status}
                    </Tag>
                </span>

                {task.deletedAt && (
                    <span>
                        Deleted: {task.deletedAt}
                    </span>
                )}

                {task.completedAt && (
                    <span>
                        Completed: {task.completedAt}
                    </span>
                )}
            </div>

            {task.tags.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                    }}
                >
                    {task.tags.map((tag) => (
                        <Tag
                            key={tag.id}
                            color="blue"
                            style={{
                                margin: 0,
                            }}
                        >
                            {tag.text}
                        </Tag>
                    ))}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8,
                }}
            >
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(task)}
                >
                    Edit
                </Button>

                {task.status === "active" && (
                    <>
                        <Button
                            icon={<CheckOutlined />}
                            onClick={() =>
                                onComplete(task.id)
                            }
                        >
                            Complete
                        </Button>

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                                onDelete(task.id)
                            }
                        >
                            Delete
                        </Button>
                    </>
                )}

                {task.status === "deleted" && (
                    <>
                        <Button
                            icon={<RollbackOutlined />}
                            onClick={() =>
                                onRestore(task.id)
                            }
                        >
                            Restore
                        </Button>

                        <Button
                            icon={<CheckOutlined />}
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
                            icon={<RollbackOutlined />}
                            onClick={() =>
                                onRestore(task.id)
                            }
                        >
                            Restore
                        </Button>

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                                onDelete(task.id)
                            }
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};