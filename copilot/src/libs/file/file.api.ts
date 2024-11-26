import { LogDebug } from "../../packages/log";
import { userStorage } from "../user";

// downloadFile 允許
export function downloadFile(dataURL: string, filename: string, filetype: string): Promise<File> {
    if (!dataURL.startsWith("data:") && !dataURL.startsWith("blob:") && !dataURL.startsWith("http")) {
        return Promise.reject("Invalid data URL");
    }

    return fetch(dataURL)
        .then(res => res.blob())
        .then(blob => new File([blob], filename, { type: filetype }));
}

export async function uploadFileToCloud(file: File) {
    LogDebug("Upload", file);
    const user = await userStorage.get();
    const token = user.icloud.access_token;
    const formData = new FormData();
    formData.append("files", file);

    if (!token) {
        return Promise.reject("no token");
    }

    return fetch(import.meta.env.VITE_FILE_SERVER_URL + "api/v1/files", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, X-Custom-Header, accept, Content-Type",
            "Access-Control-Allow-Credentials": "true",
        },
        body: formData,
    })
        .then(res => {
            if (!res.ok) throw res;
            return res.json();
        });
}

export function downloadFileToCloud(dataURL: string, filename: string, fileType: string) {
    return downloadFile(dataURL, filename, fileType)
        .then(file => uploadFileToCloud(file))
        .then((res: {message: string; error: string}) => res.error === "" ? res.message : Promise.reject(res.error));
}