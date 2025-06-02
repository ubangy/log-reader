import { LogEntry } from '../../src/interfaces/logEntry.interface';

export const mockLogEntries: LogEntry[] = [
    {
        ip: '192.168.1.1',
        userId: 'user1',
        userName: 'frank',
        timestamp: '10/Oct/2000:13:55:36 -0700',
        request: {
            method: 'GET',
            path: '/api/users',
            protocol: 'HTTP/1.1'
        },
        statusCode: 200,
        responseSize: 2326,
        referrer: 'http://example.com',
        userAgent: 'Mozilla/5.0'
    },
    {
        ip: '192.168.1.1', // Same IP as first entry
        userId: 'user2',
        userName: 'john',
        timestamp: '10/Oct/2000:13:55:37 -0700',
        request: {
            method: 'GET',
            path: '/api/users',
            protocol: 'HTTP/1.1'
        },
        statusCode: 200,
        responseSize: 1234,
        referrer: 'http://example.org',
        userAgent: 'Chrome/91.0'
    },
    {
        ip: '192.168.1.2',
        userId: 'user3',
        userName: 'alice',
        timestamp: '10/Oct/2000:13:55:38 -0700',
        request: {
            method: 'POST',
            path: '/api/data',
            protocol: 'HTTP/1.1'
        },
        statusCode: 404,
        responseSize: 123,
        referrer: 'http://example.net',
        userAgent: 'Firefox/89.0'
    },
    {
        ip: '192.168.1.3',
        userId: 'user4',
        userName: 'bob',
        timestamp: '10/Oct/2000:13:55:39 -0700',
        request: {
            method: 'GET',
            path: '/api/users',
            protocol: 'HTTP/1.1'
        },
        statusCode: 200,
        responseSize: 567,
        referrer: 'http://example.com',
        userAgent: 'Safari/14.0'
    }
]; 