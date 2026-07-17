import { Button, ColorPicker, Form, InputNumber, Spin } from "antd";

import { Link } from "react-router-dom";

import { useSettings } from "../hooks/useSettings";
import type { CardSettings } from "../types/settings";

export function Settings() {
    const {
        settings,
        isLoading,
        isFetching,
        error,
        updateSettings,
    } = useSettings();

    const saveSettings = async (
        values: CardSettings
    ) => {
        await updateSettings(values);
    };

    if (isLoading) {
        return <Spin size="large" />;
    }

    if (error || !settings) {
        return <h2>Не вдалося завантажити налаштування</h2>;
    }

    return (
        <div
            style={{
                maxWidth: 600,
                padding: 20,
            }}
        >
            {isFetching && (
                <p>Updating settings...</p>
            )}

            <Link to="/">
                <Button>Dashboard</Button>
            </Link>

            <h1>Card Settings</h1>

            <Form
                layout="vertical"
                initialValues={settings}
                onFinish={saveSettings}
            >
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
                    label="Text color"
                    name="textColor"
                    getValueFromEvent={(color) =>
                        color.toHexString()
                    }
                >
                    <ColorPicker />
                </Form.Item>

                <Form.Item
                    label="Card width"
                    name="width"
                >
                    <InputNumber min={200} max={600} />
                </Form.Item>

                <Form.Item
                    label="Card height"
                    name="height"
                >
                    <InputNumber min={200} max={700} />
                </Form.Item>

                <Form.Item
                    label="Padding"
                    name="padding"
                >
                    <InputNumber min={0} max={60} />
                </Form.Item>

                <Form.Item
                    label="Border radius"
                    name="borderRadius"
                >
                    <InputNumber min={0} max={50} />
                </Form.Item>

                <Form.Item
                    label="Title font size"
                    name="titleFontSize"
                >
                    <InputNumber min={12} max={50} />
                </Form.Item>

                <Form.Item
                    label="Description font size"
                    name="descriptionFontSize"
                >
                    <InputNumber min={10} max={40} />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                >
                    Save
                </Button>
            </Form>
        </div>
    );
}