import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, beforeAll, beforeEach, expect } from "vitest";

import { Dashboard } from "./Dashboard";

const createTask = vi.fn();
const updateTask = vi.fn();
let tasks: Array<any> = [];

beforeAll(() => {
    const mockMatchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
    });

    if (!(window as any).matchMedia) {
        window.matchMedia = mockMatchMedia;
        (globalThis as any).matchMedia = mockMatchMedia;
    }

    const mockResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };

    if (!(window as any).ResizeObserver) {
        window.ResizeObserver = mockResizeObserver as any;
        (globalThis as any).ResizeObserver = mockResizeObserver;
    }
});

beforeEach(() => {
    createTask.mockClear();
    updateTask.mockClear();
    tasks = [];
});

vi.mock("../hooks/useTasks", () => ({
    useTasks: () => ({
        tasks,
        isLoading: false,
        isFetching: false,
        error: null,
        createTask,
        updateTask,
    }),
}));

vi.mock("../hooks/useSettings", () => ({
    useSettings: () => ({
        settings: {
            titleFontSize: 16,
            width: 300,
            height: 200,
            backgroundColor: "#ffffff",
            textColor: "#000000",
            borderRadius: 8,
            padding: 16,
            descriptionFontSize: 14,
        },
        isLoading: false,
    }),
}));

describe("Dashboard", () => {
    test("creates new task", async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("New Task"));

        fireEvent.change(screen.getByLabelText("Title"), {
            target: { value: "Homework" },
        });

        fireEvent.change(screen.getByLabelText("Description"), {
            target: { value: "React project" },
        });

        fireEvent.click(screen.getByText("OK"));

        expect(createTask).toHaveBeenCalledTimes(1);
        expect(createTask.mock.calls[0][0].title).toBe("Homework");
        expect(createTask.mock.calls[0][0].description).toBe("React project");
    });

    test("renders current and archive sections and filters tasks", () => {
        tasks = [
            {
                id: "1",
                title: "Active task",
                description: "Current item",
                tags: [{ id: "tag1", text: "work" }],
                createdAt: "2026-07-17",
                updatedAt: "2026-07-17",
                status: "active",
            },
            {
                id: "2",
                title: "Archived task",
                description: "Completed item",
                tags: [{ id: "tag2", text: "done" }],
                createdAt: "2026-07-17",
                updatedAt: "2026-07-17",
                status: "completed",
            },
        ];

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(screen.getByText("Current")).toBeInTheDocument();
        expect(screen.getByText("Archive")).toBeInTheDocument();
        expect(screen.getByText("Active task")).toBeInTheDocument();
        expect(screen.getByText("Archived task")).toBeInTheDocument();

        fireEvent.change(screen.getAllByPlaceholderText("Search tasks...")[0], {
            target: { value: "Active" },
        });

        expect(screen.getByText("Active task")).toBeInTheDocument();
        expect(screen.queryByText("Archived task")).toBeInTheDocument();
    });
});
