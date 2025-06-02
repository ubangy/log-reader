import { readFile } from 'fs/promises';
import { FileReaderService } from '../src/fileReader.service';
import { mockLogContent } from './mocks/logContent.mock';

// Mock the fs/promises module
jest.mock('fs/promises', () => ({
    readFile: jest.fn()
}));

// Type assertion for the mock
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;

describe('FileReaderService', () => {
    let service: FileReaderService;

    beforeAll(() => {
        console.error = jest.fn();
        console.warn = jest.fn();
    });

    beforeEach(() => {
        service = new FileReaderService();
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('readLogFile', () => {
        it('should successfully read and parse log file', async () => {
            // Mock the readFile function
            mockedReadFile.mockResolvedValue(mockLogContent);

            const result = await service.readLogFile();

            // Verify readFile was called with correct path
            expect(mockedReadFile).toHaveBeenCalledWith(
                expect.stringContaining('data/example-data.log'),
                'utf-8'
            );

            // Verify the parsed results
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
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
            });
        });

        it('should handle empty log file', async () => {
            mockedReadFile.mockResolvedValue('');

            const result = await service.readLogFile();

            expect(result).toHaveLength(0);
        });

        it('should handle file read error', async () => {
            const mockError = new Error('File not found');
            mockedReadFile.mockRejectedValue(mockError);

            await expect(service.readLogFile()).rejects.toThrow('Failed to read log file: File not found');
        });

        it('should skip invalid log lines', async () => {
            const mockLogContent = `192.168.1.1 user1 frank [10/Oct/2000:13:55:36 -0700] "GET /api/users HTTP/1.1" 200 2326 "http://example.com" "Mozilla/5.0"
invalid line
192.168.1.2 user2 john [10/Oct/2000:13:55:37 -0700] "POST /api/data HTTP/1.1" 404 123 "http://example.org" "Chrome/91.0"`;

            mockedReadFile.mockResolvedValue(mockLogContent);

            const result = await service.readLogFile();

            expect(result).toHaveLength(2); // Should only include valid lines
        });
    });

    describe('parseLogLine', () => {
        it('should correctly parse a valid log line', () => {
            const validLogLine = '192.168.1.1 user1 frank [10/Oct/2000:13:55:36 -0700] "GET /api/users HTTP/1.1" 200 2326 "http://example.com" "Mozilla/5.0"';
            
            const result = (service as any).parseLogLine(validLogLine);

            expect(result).toEqual({
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
            });
        });

        it('should return null for invalid log line', () => {
            const invalidLogLine = 'invalid log line';
            
            const result = (service as any).parseLogLine(invalidLogLine);

            expect(result).toBeNull();
        });

        it('should handle log line with missing fields', () => {
            const incompleteLogLine = '192.168.1.1 user1 frank [10/Oct/2000:13:55:36 -0700] "GET /api/users HTTP/1.1"';
            
            const result = (service as any).parseLogLine(incompleteLogLine);

            expect(result).toBeNull();
        });
    });
}); 