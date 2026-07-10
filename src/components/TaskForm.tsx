import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import type { Task } from "../types/task";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string, tags: string) => void;
    task?: Task | null;
};

export const TaskForm = ({ open, onClose, onCreate, task }: Props) => {
    const [form] = Form.useForm();
    useEffect(() => {
    if (task) {
        form.setFieldsValue({
            title: task.title,
            description: task.description,
            tags: task.tags.map(tag => tag.text).join(", "),
        });
    } else {
        form.resetFields();
    }}, [task, form]);
    const handleOk = () => {
        const values = form.getFieldsValue();
        onCreate(values.title, values.description, values.tags);
        form.resetFields();
        onClose();
    }
    return (
        <Modal
            open={open}
            title="Create task"
            onCancel={onClose}
            onOk={handleOk}
        >
            <Form
                form = {form} 
                layout="vertical"
            >

                <Form.Item 
                    label="Title"
                    name="title"
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Description" 
                    name="description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item 
                    label="Tags" 
                    name="tags"
                >
                    <Input placeholder="tag1, tag2, tag3" />
                </Form.Item>

            </Form>
        </Modal>

    );
}