import { Input, Checkbox } from "antd";

export const SearchBar = () => {
    return(
        <>
            <Input placeholder="Search..." />
            <br />
            <br />
            <Checkbox>
                Title
            </Checkbox>

            <Checkbox>
                Description
            </Checkbox>

            <Checkbox>
                Tags
            </Checkbox>
        </>
    )
}