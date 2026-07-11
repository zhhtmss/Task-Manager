import { useEffect } from "react";
import { ColorPicker, Form, Input, Modal, Slider, Upload, Button} from "antd";
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
    ) => void;
    task?: Task | null;
};

export const TaskForm = ({
    open,
    onClose,
    onCreate,
    task,
}: Props) => {
    const [form] = Form.useForm();

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
                    task.imageOpacity || 0.3,
            });
        } else {
            form.resetFields();

            form.setFieldsValue({
                backgroundColor: "#ffffff",
                imageOpacity: 0.3,
            });
        }
    }, [task, form, open]);

    const handleOk = () => {
        const values = form.getFieldsValue();

        onCreate(
            values.title,
            values.description,
            values.tags || "",
            values.backgroundColor || "#ffffff",
            values.backgroundImage || "",
            values.imageOpacity || 0.3
        );

        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={open}
            title={task ? "Edit task" : "Create task"}
            onCancel={onClose}
            onOk={handleOk}
        >
            <Form
                form={form}
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
                    <Input placeholder="react, study, vite" />
                </Form.Item>

                <Form.Item
                    label="Background color"
                    name="backgroundColor"
                    getValueFromEvent={(color) =>
                        color.toHexString()
                    }
                >
                    <ColorPicker />
                </Form.Item>

                <Form.Item
                    label="Background image URL"
                    name="backgroundImage"
                >
                    <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item
                    label="Upload image"
                    name="backgroundFile"
                >
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