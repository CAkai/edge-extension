export function chromeNotify(type: "success" | "error", id: string, title: string, message: string) {
    switch (type) {
        case "success":
            _notify(id, title, message, "images/check.png", 5000);
            break;
        case "error":
            _notify(id, title, message, "images/cancel.png", 5000);
            break;
    }
}

function _notify(id: string, title: string, message: string, iconURL: string, duration: number) {
    chrome.notifications.create(
        id,
        {
            type: "basic",
            iconUrl: iconURL,
            title: title,
            message: message,
        },
        (notificationId) => {
            setTimeout(() => {
                chrome.notifications.clear(notificationId);
            }, duration);
        });
}