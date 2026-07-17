import { ArrowLeftOutlined, BgColorsOutlined, BorderOutlined, FontSizeOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";

import { Button, ColorPicker, Form, InputNumber, message, Spin } from "antd";

import { Link } from "react-router-dom";

import { useSettings } from "../hooks/useSettings";
import type { CardSettings } from "../types/settings";

export function Settings() {
    const [form] = Form.useForm<CardSettings>();

    const [
        messageApi,
        contextHolder,
    ] = message.useMessage();

    const {
        settings,
        isLoading,
        isFetching,
        error,
        updateSettings,
    } = useSettings();

    const defaultSettings: CardSettings = {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        padding: 16,
        borderRadius: 8,
        width: 320,
        height: 350,
        titleFontSize: 18,
        descriptionFontSize: 14,
    };

    const saveSettings = async (
        values: CardSettings
    ) => {
        try {
            await updateSettings(values);

            messageApi.success(
                "Settings saved successfully"
            );
        } catch {
            messageApi.error(
                "Failed to save settings"
            );
        }
    };

    const resetSettings = async () => {
        try {
            await updateSettings(defaultSettings);

            form.setFieldsValue(defaultSettings);

            messageApi.success(
                "Settings reset to default"
            );
        } catch {
            messageApi.error(
                "Failed to reset settings"
            );
        }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <Spin size="large" />

                    <p
                        style={{
                            marginTop: 15,
                            color: "#64748b",
                        }}
                    >
                        Loading settings...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !settings) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    background:
                        "linear-gradient(135deg, #eef2ff, #f8fafc)",
                }}
            >
                <div
                    style={{
                        maxWidth: 500,
                        width: "100%",
                        padding: 30,
                        textAlign: "center",
                        backgroundColor: "#ffffff",
                        borderRadius: 20,
                        boxShadow:
                            "0 10px 30px rgba(15, 23, 42, 0.1)",
                    }}
                >
                    <h2>
                        Failed to load settings
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        Check whether the Express
                        server is running.
                    </p>

                    <Link to="/">
                        <Button
                            type="primary"
                            icon={
                                <ArrowLeftOutlined />
                            }
                        >
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "30px 20px",
                background:
                    "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #ecfeff 100%)",
            }}
        >
            {contextHolder}

            {isFetching && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 18px",
                        backgroundColor:
                            "rgba(255, 255, 255, 0.95)",
                        border:
                            "1px solid #e2e8f0",
                        borderRadius: 12,
                        boxShadow:
                            "0 8px 25px rgba(0, 0, 0, 0.12)",
                    }}
                >
                    <Spin size="small" />

                    <span>
                        Updating settings...
                    </span>
                </div>
            )}

            <div
                style={{
                    maxWidth: 1000,
                    margin: "0 auto",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: 20,
                        flexWrap: "wrap",
                        marginBottom: 30,
                        padding: "24px 28px",
                        backgroundColor:
                            "rgba(255, 255, 255, 0.9)",
                        border:
                            "1px solid #e2e8f0",
                        borderRadius: 20,
                        boxShadow:
                            "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                >
                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 34,
                                color: "#0f172a",
                            }}
                        >
                            ⚙ Card Settings
                        </h1>

                        <p
                            style={{
                                marginTop: 8,
                                marginBottom: 0,
                                color: "#64748b",
                            }}
                        >
                            Customize the default
                            appearance of task cards
                        </p>
                    </div>

                    <Link to="/">
                        <Button
                            size="large"
                            icon={
                                <ArrowLeftOutlined />
                            }
                        >
                            Dashboard
                        </Button>
                    </Link>
                </header>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 25,
                    }}
                >
                    <section
                        style={{
                            padding: 25,
                            backgroundColor:
                                "rgba(255, 255, 255, 0.95)",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius: 20,
                            boxShadow:
                                "0 8px 25px rgba(15, 23, 42, 0.07)",
                        }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={settings}
                            onFinish={saveSettings}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 20,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        display: "flex",
                                        justifyContent:
                                            "center",
                                        alignItems:
                                            "center",
                                        borderRadius: 12,
                                        color: "#1677ff",
                                        backgroundColor:
                                            "#e6f4ff",
                                        fontSize: 20,
                                    }}
                                >
                                    <BgColorsOutlined />
                                </div>

                                <div>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: 21,
                                            color: "#0f172a",
                                        }}
                                    >
                                        Appearance
                                    </h2>

                                    <p
                                        style={{
                                            margin: 0,
                                            marginTop: 4,
                                            color: "#64748b",
                                        }}
                                    >
                                        Colors and spacing
                                    </p>
                                </div>
                            </div>

                            <Form.Item
                                label="Background color"
                                name="backgroundColor"
                                getValueFromEvent={(
                                    color
                                ) =>
                                    color.toHexString()
                                }
                            >
                                <ColorPicker
                                    showText
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Text color"
                                name="textColor"
                                getValueFromEvent={(
                                    color
                                ) =>
                                    color.toHexString()
                                }
                            >
                                <ColorPicker
                                    showText
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Padding"
                                name="padding"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Enter padding",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    max={60}
                                    addonAfter="px"
                                    style={{
                                        width: "100%",
                                    }}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Border radius"
                                name="borderRadius"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Enter border radius",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    max={50}
                                    addonAfter="px"
                                    style={{
                                        width: "100%",
                                    }}
                                    size="large"
                                />
                            </Form.Item>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginTop: 30,
                                    marginBottom: 20,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        display: "flex",
                                        justifyContent:
                                            "center",
                                        alignItems:
                                            "center",
                                        borderRadius: 12,
                                        color: "#722ed1",
                                        backgroundColor:
                                            "#f9f0ff",
                                        fontSize: 20,
                                    }}
                                >
                                    <BorderOutlined />
                                </div>

                                <div>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: 21,
                                            color: "#0f172a",
                                        }}
                                    >
                                        Card size
                                    </h2>

                                    <p
                                        style={{
                                            margin: 0,
                                            marginTop: 4,
                                            color: "#64748b",
                                        }}
                                    >
                                        Default card dimensions
                                    </p>
                                </div>
                            </div>

                            <Form.Item
                                label="Card width"
                                name="width"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Enter card width",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={250}
                                    max={800}
                                    addonAfter="px"
                                    style={{
                                        width: "100%",
                                    }}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Minimum card height"
                                name="height"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Enter card height",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={200}
                                    max={800}
                                    addonAfter="px"
                                    style={{
                                        width: "100%",
                                    }}
                                    size="large"
                                />
                            </Form.Item>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginTop: 30,
                                    marginBottom: 20,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        display: "flex",
                                        justifyContent:
                                            "center",
                                        alignItems:
                                            "center",
                                        borderRadius: 12,
                                        color: "#13c2c2",
                                        backgroundColor:
                                            "#e6fffb",
                                        fontSize: 20,
                                    }}
                                >
                                    <FontSizeOutlined />
                                </div>

                                <div>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: 21,
                                            color: "#0f172a",
                                        }}
                                    >
                                        Typography
                                    </h2>

                                    <p
                                        style={{
                                            margin: 0,
                                            marginTop: 4,
                                            color: "#64748b",
                                        }}
                                    >
                                        Text sizes inside cards
                                    </p>
                                </div>
                            </div>

                            <Form.Item
                                label="Title font size"
                                name="titleFontSize"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Enter title font size",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={12}
                                    max={50}
                                    addonAfter="px"
                                    style={{
                                        width: "100%",
                                    }}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Description font size"
                                name="descriptionFontSize"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Enter description font size",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={10}
                                    max={40}
                                    addonAfter="px"
                                    style={{
                                        width: "100%",
                                    }}
                                    size="large"
                                />
                            </Form.Item>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    marginTop: 10,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    icon={
                                        <SaveOutlined />
                                    }
                                    loading={isFetching}
                                    style={{
                                        flex: 1,
                                        minWidth: 190,
                                        height: 48,
                                        borderRadius: 10,
                                        fontWeight: 600,
                                    }}
                                >
                                    Save Settings
                                </Button>

                                <Button
                                    danger
                                    size="large"
                                    icon={
                                        <ReloadOutlined />
                                    }
                                    disabled={isFetching}
                                    onClick={resetSettings}
                                    style={{
                                        flex: 1,
                                        minWidth: 190,
                                        height: 48,
                                        borderRadius: 10,
                                        fontWeight: 600,
                                    }}
                                >
                                    Reset to Default
                                </Button>
                            </div>
                        </Form>
                    </section>

                    <section
                        style={{
                            padding: 25,
                            alignSelf: "start",
                            backgroundColor:
                                "rgba(255, 255, 255, 0.95)",
                            border:
                                "1px solid #e2e8f0",
                            borderRadius: 20,
                            boxShadow:
                                "0 8px 25px rgba(15, 23, 42, 0.07)",
                        }}
                    >
                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: 8,
                                color: "#0f172a",
                            }}
                        >
                            Live preview
                        </h2>

                        <p
                            style={{
                                marginTop: 0,
                                marginBottom: 25,
                                color: "#64748b",
                            }}
                        >
                            Preview of the current
                            card settings
                        </p>

                        <div
                            style={{
                                width: "100%",
                                maxWidth:
                                    settings.width,
                                minHeight:
                                    settings.height,
                                boxSizing:
                                    "border-box",
                                padding:
                                    settings.padding,
                                color:
                                    settings.textColor,
                                backgroundColor:
                                    settings.backgroundColor,
                                borderRadius:
                                    settings.borderRadius,
                                border:
                                    "1px solid #dbeafe",
                                boxShadow:
                                    "0 10px 30px rgba(15, 23, 42, 0.12)",
                                overflowWrap:
                                    "anywhere",
                            }}
                        >
                            <h3
                                style={{
                                    marginTop: 0,
                                    marginBottom: 15,
                                    fontSize:
                                        settings.titleFontSize,
                                }}
                            >
                                Example task
                            </h3>

                            <p
                                style={{
                                    fontSize:
                                        settings.descriptionFontSize,
                                }}
                            >
                                This is how your task
                                card will look with the
                                selected settings.
                            </p>

                            <p>
                                Created: 17.07.2026
                            </p>

                            <p>
                                Status: active
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    marginTop: 18,
                                }}
                            >
                                <span
                                    style={{
                                        padding:
                                            "4px 10px",
                                        color: "#1677ff",
                                        backgroundColor:
                                            "#e6f4ff",
                                        border:
                                            "1px solid #91caff",
                                        borderRadius: 6,
                                    }}
                                >
                                    react
                                </span>

                                <span
                                    style={{
                                        padding:
                                            "4px 10px",
                                        color: "#389e0d",
                                        backgroundColor:
                                            "#f6ffed",
                                        border:
                                            "1px solid #b7eb8f",
                                        borderRadius: 6,
                                    }}
                                >
                                    study
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: 25,
                                padding: 18,
                                color: "#475569",
                                backgroundColor:
                                    "#f8fafc",
                                border:
                                    "1px solid #e2e8f0",
                                borderRadius: 14,
                            }}
                        >
                            <strong>
                                Current values
                            </strong>

                            <p>
                                Width:{" "}
                                {settings.width}px
                            </p>

                            <p>
                                Minimum height:{" "}
                                {settings.height}px
                            </p>

                            <p>
                                Padding:{" "}
                                {settings.padding}px
                            </p>

                            <p
                                style={{
                                    marginBottom: 0,
                                }}
                            >
                                Border radius:{" "}
                                {
                                    settings.borderRadius
                                }
                                px
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}