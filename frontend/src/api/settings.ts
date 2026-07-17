import type { CardSettings } from "../types/settings";

export const getSettings = async (): Promise<CardSettings> => {
    const response = await fetch("/api/settings");

    if (!response.ok) {
        throw new Error("Не вдалося завантажити налаштування");
    }

    return response.json();
};

export const updateSettingsRequest = async (
    changes: Partial<CardSettings>
): Promise<CardSettings> => {
    const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
    });

    if (!response.ok) {
        throw new Error("Не вдалося зберегти налаштування");
    }

    return response.json();
};