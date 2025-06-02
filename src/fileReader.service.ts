import { readFile } from 'fs/promises';
import { join } from 'path';
import { LogEntry } from './interfaces/logEntry.interface';

const LOG_FILENAME = 'example-data.log';

export class FileReaderService {
    async readLogFile(): Promise<LogEntry[]> {
        try {
            const filePath = join(process.cwd(), 'data', LOG_FILENAME);
            const content = await readFile(filePath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            
            return lines.map(line => this.parseLogLine(line)).filter((entry): entry is LogEntry => entry !== null);
        } catch (error: unknown) {
            console.error('Error reading log file:', error);
            throw new Error(`Failed to read log file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private parseLogLine(line: string): LogEntry | null {
        // Regex security risk because of backtracking. Plus it's very hard to read and maintain.
        // https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS#:~:text=Risk%20Factors,stack%20a%20vulnerable%20WEB%20server.
        // const logRegex = /^(\S+) (\S+) (\S+) \[([^\]]+)\] "(\S+) ([^"]+) (\S+)" (\d+) (\d+) "([^"]*)" "([^"]*)"(.*)$/;

        try {
            // Split the line into parts
            const parts = line.split(' ');
            
            // Extract basic fields
            const ip = parts[0];
            const userId = parts[1];
            const userName = parts[2];
            
            // Extract timestamp (it's in brackets)
            const timestampStart = line.indexOf('[');
            const timestampEnd = line.indexOf(']');
            if (timestampStart === -1 || timestampEnd === -1) {
                throw new Error('Invalid timestamp format');
            }
            const timestamp = line.slice(timestampStart + 1, timestampEnd);
            
            // Extract request (it's in quotes)
            const requestStart = line.indexOf('"', timestampEnd);
            const requestEnd = line.indexOf('"', requestStart + 1);
            if (requestStart === -1 || requestEnd === -1) {
                throw new Error('Invalid request format');
            }
            const requestStr = line.slice(requestStart + 1, requestEnd);
            const [method, path, protocol] = requestStr.split(' ');
            
            // Extract remaining fields
            const remainingParts = line.slice(requestEnd + 1).trim().split(' ');
            const statusCode = parseInt(remainingParts[0], 10);
            const responseSize = parseInt(remainingParts[1], 10);
            
            // Extract referrer (it's in quotes)
            const referrerStart = line.indexOf('"', requestEnd + 1);
            const referrerEnd = line.indexOf('"', referrerStart + 1);
            if (referrerStart === -1 || referrerEnd === -1) {
                throw new Error('Invalid referrer format');
            }
            const referrer = line.slice(referrerStart + 1, referrerEnd);
            
            // Extract user agent (it's in the last quotes)
            const userAgentStart = line.indexOf('"', referrerEnd + 1);
            const userAgentEnd = line.lastIndexOf('"');
            if (userAgentStart === -1 || userAgentEnd === -1) {
                throw new Error('Invalid user agent format');
            }
            const userAgent = line.slice(userAgentStart + 1, userAgentEnd);

            return {
                ip,
                userId,
                userName,
                timestamp,
                request: {
                    method,
                    path,
                    protocol
                },
                statusCode,
                responseSize,
                referrer,
                userAgent
            };
        } catch (error) {
            console.warn(`Failed to parse line: ${line}`);
            return null;
        }
    }
}
