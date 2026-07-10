import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { CardSettings } from "../types/settings";

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

type SettingsContextType = {
    settings: CardSettings;
    changeSettings: (newSettings: CardSettings) => void;
    resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

type Props = {
    children: ReactNode;
};

export const SettingsProvider = ({ children }: Props) => {
    const savedSettings = localStorage.getItem("cardSettings");

    const [settings, setSettings] = useState<CardSettings>(
        savedSettings
            ? JSON.parse(savedSettings)
            : defaultSettings
    );

    const changeSettings = (newSettings: CardSettings) => {
        setSettings(newSettings);

        localStorage.setItem(
            "cardSettings",
            JSON.stringify(newSettings)
        );
    };

    const resetSettings = () => {
        setSettings(defaultSettings);

        localStorage.setItem(
            "cardSettings",
            JSON.stringify(defaultSettings)
        );
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                changeSettings,
                resetSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettings должен использоваться внутри SettingsProvider"
        );
    }

    return context;
};