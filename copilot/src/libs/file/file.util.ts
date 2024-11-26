export function getImageData(dataURL: string) {
    // 先嘗試抓取名字看看
    const rFile = new RegExp(/^https?:\/\/.*\/(.*\.([jJ][pP][gG]|[pP][nN][gG]|[jJ][pP][eE][gG]))$/);
    const match = rFile.exec(dataURL);
    // 設定檔名和檔案類型
    let fileName = "image.png";
    let fileType = "image/png";
    if (match) {
        fileName = match[1].toLowerCase();
        if (["jpg", "jpeg"].includes(match[2].toLowerCase())) {
            fileType = "image/jpeg";
        }
    }
    return {
        fileName,
        fileType
    };
}