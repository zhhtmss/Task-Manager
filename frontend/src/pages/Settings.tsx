import { Button, ColorPicker, Form, InputNumber} from "antd";

import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import type { CardSettings } from "../types/settings";

export function Settings() {
    const { settings, changeSettings, resetSettings} = useSettings();

    const [form] = Form.useForm();

    const saveSettings = (values: CardSettings) => {
        changeSettings(values);
    };

    const reset = () => {
        resetSettings();

        form.setFieldsValue({
            backgroundColor: "#ffffff",
            textColor: "#000000",
            padding: 16,
            borderRadius: 8,
            width: 320,
            height: 350,
            titleFontSize: 18,
            descriptionFontSize: 14,
        });
    };

    return (
        <div
            style={{
                padding: 20,
                maxWidth: 600,
            }}
        >
            <Link to="/">
                <Button>Dashboard</Button>
            </Link>

            <h1>Card Settings</h1>

            <Form
                form={form}
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

                {" "}

                <Button onClick={reset}>
                    Reset
                </Button>
            </Form>
        </div>
    );
}