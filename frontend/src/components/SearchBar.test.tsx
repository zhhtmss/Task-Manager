import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";

import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
    test("calls callbacks when input changes and mode buttons are clicked", () => {
        const onSearchChange = vi.fn();
        const onModeChange = vi.fn();

        render(
            <SearchBar
                search=""
                modes={{ title: false, description: false, tags: false }}
                onSearchChange={onSearchChange}
                onModeChange={onModeChange}
            />
        );

        fireEvent.change(
            screen.getByPlaceholderText("Search tasks..."),
            { target: { value: "urgent" } }
        );

        expect(onSearchChange).toHaveBeenCalledWith("urgent");

        fireEvent.click(screen.getByRole("button", { name: /Title/i }));
        fireEvent.click(screen.getByRole("button", { name: /Description/i }));
        fireEvent.click(screen.getByRole("button", { name: /Tags/i }));

        expect(onModeChange).toHaveBeenNthCalledWith(1, "title");
        expect(onModeChange).toHaveBeenNthCalledWith(2, "description");
        expect(onModeChange).toHaveBeenNthCalledWith(3, "tags");
    });
});
