import { Modal, Form, Input } from "antd";

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string, tags: string) => void;
};

export const TaskForm = ({ open, onClose, onCreate }: Props) => {
    const [form] = Form.useForm();
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