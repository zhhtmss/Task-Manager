import type { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 60 * 24,
            refetchOnWindowFocus: false,
        },
    },
});

const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: "task-manager-cache",
});

type Props = {
    children: ReactNode;
};

export const Provider = ({ children }: Props) => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24,
            }}
        >
            {children}
        </PersistQueryClientProvider>
    );
};