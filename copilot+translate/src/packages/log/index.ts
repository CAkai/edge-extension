export enum LogLevel {
    Debug = "DEBUG",
    Info = "INFO",
    Warning = "WARNING",
    Error = "ERROR",
    Fatal = "FATAL",
    System = "SYS",
}

const LogLevelOrder = [LogLevel.Debug, LogLevel.Info, LogLevel.Warning, LogLevel.Error, LogLevel.Fatal, LogLevel.System];

function Log(level: LogLevel, message: string) {
    return `[${level}] ${message}`;
}

function canShowLog(level: LogLevel) {
    const targetLevel: string = import.meta.env.VITE_LOG_LEVEL;

    // 這裡強制轉換成大寫，防止大小寫不一致的問題
    const targetIndex = LogLevelOrder.indexOf(targetLevel.toUpperCase() as LogLevel);

    // 如果找不到對應的 log level，就直接報錯
    if (targetIndex === -1) {
        LogError(`Invalid log level: ${import.meta.env.VITE_LOG_LEVEL}`);
        return false;
    }

    return LogLevelOrder.indexOf(level) >= targetIndex;
}

export function LogDebug(message: string) {
    if (canShowLog(LogLevel.Debug)) console.log(Log(LogLevel.Debug, message));
}

export function LogInfo(message: string) {
    if (canShowLog(LogLevel.Info)) console.log(Log(LogLevel.Info, message));
}

export function LogWarning(message: string) {
    if (canShowLog(LogLevel.Warning)) console.log(Log(LogLevel.Warning, message));
}

export function LogError(message: string) {
    if (canShowLog(LogLevel.Error)) console.error(Log(LogLevel.Error, message));
}

export function LogFatal(message: string) {
    if (canShowLog(LogLevel.Fatal)) console.error(Log(LogLevel.Fatal, message));
}

export function LogSystem(message: string) {
    if (canShowLog(LogLevel.System)) console.log(Log(LogLevel.System, message));
}