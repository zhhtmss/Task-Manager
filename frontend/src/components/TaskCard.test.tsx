import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, beforeAll, beforeEach, expect } from "vitest";

import { TaskCard } from "./TaskCard";
import type { Task } from "../types/task";

const mockUseSettings = vi.fn();

vi.mock("../hooks/useSettings", () => ({
  useSettings: () => mockUseSettings(),
}));

beforeAll(() => {
  if (!(window as any).matchMedia) {
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

    window.matchMedia = mockMatchMedia;
    (globalThis as any).matchMedia = mockMatchMedia;
  }

  const mockResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  window.ResizeObserver = mockResizeObserver as any;
  (globalThis as any).ResizeObserver = mockResizeObserver;
});

beforeEach(() => {
  mockUseSettings.mockReset();
  mockUseSettings.mockReturnValue({
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
  });
});

describe("TaskCard", () => {
  const task: Task = {
    id: "task-1",
    title: "Test task",
    description: "Description of the task.",
    tags: [
      { id: "tag-1", text: "work" },
      { id: "tag-2", text: "urgent" },
    ],
    createdAt: "2026-07-17",
    updatedAt: "2026-07-17",
    status: "active",
  };

  test("renders active task details and calls action handlers", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onComplete = vi.fn();
    const onRestore = vi.fn();

    render(
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onComplete={onComplete}
        onRestore={onRestore}
      />,
    );

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("Description of the task.")).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText("work")).toBeInTheDocument();
    expect(screen.getByText("urgent")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    expect(onEdit).toHaveBeenCalledWith(task);

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    expect(onDelete).toHaveBeenCalledWith("task-1");

    fireEvent.click(screen.getByRole("button", { name: /Complete/i }));
    expect(onComplete).toHaveBeenCalledWith("task-1");
  });

  test("renders restore button for deleted task", () => {
    const deletedTask: Task = {
      ...task,
      status: "deleted",
      deletedAt: "2026-07-17",
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onComplete = vi.fn();
    const onRestore = vi.fn();

    render(
      <TaskCard
        task={deletedTask}
        onEdit={onEdit}
        onDelete={onDelete}
        onComplete={onComplete}
        onRestore={onRestore}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Restore/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Restore/i }));
    expect(onRestore).toHaveBeenCalledWith("task-1");
  });
});
