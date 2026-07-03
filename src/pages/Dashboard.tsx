import { useState } from "react";
import { Button } from "antd";
import { SearchBar}  from "../components/SearchBar";
import { TaskForm } from "../components/TaskForm";

export function Dashboard() {
    const [open, setOpen] = useState(false);
    
    return (
        <div style={{ padding: 20 }}>

            <h1>Dashboard</h1>

            <Button 
                type="primary"
                onClick={() => setOpen(true)}
            >
                New Task
            </Button>

            <TaskForm
                open={open}
                onClose={() => setOpen(false)}
            />

            <br />
            <br />

            <h2>Current</h2>

            <SearchBar />

            <br />

            <div>
                Tasks...
            </div>

            <hr />

            <h2>Archive</h2>

            <SearchBar />

            <br />

            <div>
                Archive...
            </div>

        </div>
    );
}