import { Modal, Form, Input } from "antd";

type Props = {
    open: boolean;
    onClose: () => void;
};

export const TaskForm = ({ open, onClose }: Props) => {
    return (
        <Modal
            open={open}
            title="Create task"
            onCancel={onClose}
            onOk={onClose}
        >
            <Form layout="vertical">

                <Form.Item label="Title">
                    <Input />
                </Form.Item>

                <Form.Item label="Description">
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Tags">
                    <Input placeholder="tag1, tag2, tag3" />
                </Form.Item>

            </Form>
        </Modal>

    );
}