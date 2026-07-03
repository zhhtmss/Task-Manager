import { Button } from "antd";
import { SearchBar}  from "../components/SearchBar";

export function Dashboard() {
    return (
        <div style={{ padding: 20 }}>

            <h1>Dashboard</h1>

            <Button type="primary">
                New Task
            </Button>

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