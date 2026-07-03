import { Card, Tag, Button } from "antd";
import type { Task } from "../types/task";

type Props ={
    task: Task;
};

export const TaskCard = ({ task }: Props) => {
    return (
        <Card
            title={task.title}
            style={{
                width: 320,
                background: task.backgroundColor,
            }}
        >
            <p>{task.description}</p>
            
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

            <Button danger>
                Delete
            </Button>
        </Card>
    );
};
