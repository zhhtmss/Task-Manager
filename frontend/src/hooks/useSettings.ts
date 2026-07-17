import { useQuery } from "@tanstack/react-query";

import {
    getSettings,
    updateSettingsRequest,
} from "../api/settings";

import type { CardSettings } from "../types/settings";

export const useSettings = () => {
    const settingsQuery = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    const updateSettings = async (
        changes: Partial<CardSettings>
    ) => {
        await updateSettingsRequest(changes);
        await settingsQuery.refetch();
    };

    return {
        settings: settingsQuery.data,
        isLoading: settingsQuery.isLoading,
        isFetching: settingsQuery.isFetching,
        error: settingsQuery.error,
        updateSettings,
    };
};