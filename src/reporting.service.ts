import { LogEntry } from "./interfaces/logEntry.interface";

export class ReportingService {
    constructor(private readonly logEntries: LogEntry[]) {}

    getNumberOfUniqueIps(): number {
        return new Set(this.logEntries.map(entry => entry.ip)).size;
    }

    getTop3MostVisitedIps(): string[] {
        const ipCounts = this.logEntries.reduce((acc, entry) => {
            acc[entry.ip] = (acc[entry.ip] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(ipCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(entry => entry[0]);
    }

    getTop3MostVisitedUrls(): string[] {
        const urlCounts = this.logEntries.reduce((acc, entry) => {
            acc[entry.request.path] = (acc[entry.request.path] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(urlCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(entry => entry[0]);
    }
}