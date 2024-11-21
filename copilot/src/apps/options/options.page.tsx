import { useStorage } from "../../packages/storage";
import { themeStorage } from "../../libs/theme";

export default function Options() {
    const theme = useStorage(themeStorage);
    return (
        <div>
            <h1>Options</h1>
            <p>目前主題為 {theme}</p>
            <p>目前 iCloud 連線網址為 {import.meta.env.VITE_ICLOUD_URL}</p>
            <p>目前 Open WebUI 連線網址為 {import.meta.env.VITE_OPEN_WEBUI_URL}</p>
            <p>目前 檔案上傳服務 連線網址為 {import.meta.env.VITE_FILE_SERVER_URL}</p>
        </div>
    )
}