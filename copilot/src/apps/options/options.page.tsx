import { useStorage } from "../../packages/storage";
import { themeStorage } from "../../libs/theme";

export default function Options() {
    const theme = useStorage(themeStorage);
    return (
        <div>
            <h1>Options</h1>
            <p>目前主題為 {theme}</p>
        </div>
    )
}