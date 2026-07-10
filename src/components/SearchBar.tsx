import { Button, Input } from "antd";

export type SearchModes = {
    title: boolean;
    description: boolean;
    tags: boolean;
};

type Props = {
    search: string;
    modes: SearchModes;
    onSearchChange: (value: string) => void;
    onModeChange: (name: keyof SearchModes) => void;
};

export const SearchBar = ({ search, modes, onSearchChange, onModeChange}: Props) => {
    return (
        <div
            style={{
                display: "flex",
                gap: 8,
                marginBottom: 20,
                flexWrap: "wrap",
            }}
        >
            <Input
                value={search}
                placeholder="Search tasks..."
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                style={{ width: 300 }}
            />

            <Button
                type={modes.title ? "primary" : "default"}
                onClick={() => onModeChange("title")}
            >
                Title
            </Button>

            <Button
                type={modes.description ? "primary" : "default"}
                onClick={() => onModeChange("description")}
            >
                Description
            </Button>

            <Button
                type={modes.tags ? "primary" : "default"}
                onClick={() => onModeChange("tags")}
            >
                Tags
            </Button>
        </div>
    );
};