import { useEffect, useState } from "react";
import { Button, ColorPicker, Form, Input, Modal, Slider, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import type { Task } from "../types/task";

type Props = {
    open: boolean;
    onClose: () => void;

    onCreate: (
        title: string,
        description: string,
        tags: string,
        backgroundColor: string,
        backgroundImage: string,
        imageOpacity: number
    ) => Promise<void>;

    task?: Task | null;
};

export const TaskForm = ({
    open,
    onClose,
    onCreate,
    task,
}: Props) => {
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (task) {
            form.setFieldsValue({
                title: task.title,
                description: task.description,

                tags: task.tags
                    .map((tag) => tag.text)
                    .join(", "),

                backgroundColor:
                    task.backgroundColor || "#ffffff",

                backgroundImage:
                    task.backgroundImage || "",

                imageOpacity:
                    task.imageOpacity ?? 0.3,
            });
        } else {
            form.resetFields();

            form.setFieldsValue({
                backgroundColor: "#ffffff",
                backgroundImage: "",
                imageOpacity: 0.3,
            });
        }
    }, [task, form, open]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            setIsSaving(true);

            await onCreate(
                values.title,
                values.description || "",
                values.tags || "",
                values.backgroundColor || "#ffffff",
                values.backgroundImage || "",
                values.imageOpacity ?? 0.3
            );

            form.resetFields();
            onClose();
        } catch (error) {
            console.log("Task was not saved", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (isSaving) {
            return;
        }

        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={open}
            width={700}
            title={task ? "Edit task" : "Create task"}
            onCancel={handleCancel}
            onOk={handleOk}
            confirmLoading={isSaving}
            okText={task ? "Save" : "Create"}
            cancelText="Cancel"
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "Enter task title",
                        },
                    ]}
                >
                    <Input placeholder="Task title" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Task description"
                    />
                </Form.Item>

                <Form.Item
                    label="Tags"
                    name="tags"
                >
                    <Input placeholder="react, study, vite" />
                </Form.Item>

                <Form.Item
                    label="Background color"
                    name="backgroundColor"
                    getValueFromEvent={(color) =>
                        color.toHexString()
                    }
                >
                    <ColorPicker showText />
                </Form.Item>

                <Form.Item
                    label="Background image URL"
                    name="backgroundImage"
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item label="Upload image">
                    <Upload
                        beforeUpload={(file) => {
                            const reader = new FileReader();

                            reader.onload = () => {
                                form.setFieldValue(
                                    "backgroundImage",
                                    reader.result
                                );
                            };

                            reader.readAsDataURL(file);

                            return false;
                        }}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>
                            Choose image
                        </Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Image opacity"
                    name="imageOpacity"
                >
                    <Slider
                        min={0}
                        max={1}
                        step={0.1}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};