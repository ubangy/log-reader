export interface LogEntry {
    ip: string;
    userId: string;
    userName: string;
    timestamp: string;
    request: {
        method: string;
        path: string;
        protocol: string;
    };
    statusCode: number;
    responseSize: number;
    referrer: string;
    userAgent: string;
}