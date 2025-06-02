import { ReportingService } from '../src/reporting.service';
import { mockLogEntries } from './mocks/logEntries.mock';

describe('ReportingService', () => {
    let service: ReportingService;

    beforeEach(() => {
        service = new ReportingService(mockLogEntries);
    });

    describe('getNumberOfUniqueIps', () => {
        it('should return the correct number of unique IPs', () => {
            const uniqueIps = service.getNumberOfUniqueIps();
            expect(uniqueIps).toBe(3); // 192.168.1.1, 192.168.1.2, 192.168.1.3
        });

        it('should return 0 for empty log entries', () => {
            const emptyService = new ReportingService([]);
            expect(emptyService.getNumberOfUniqueIps()).toBe(0);
        });
    });

    describe('getTop3MostVisitedIps', () => {
        it('should return the top 3 most visited IPs in descending order', () => {
            const topIps = service.getTop3MostActiveIps();
            // 192.168.1.1 appears twice, 192.168.1.2 and 192.168.1.3 appear once each
            // When counts are equal, sort by IP address
            expect(topIps).toEqual(['192.168.1.1', '192.168.1.2', '192.168.1.3']);
        });

        it('should return all IPs if there are less than 3 unique IPs', () => {
            const limitedEntries = mockLogEntries.slice(0, 3); // First 3 entries: 192.168.1.1 (twice) and 192.168.1.2 (once)
            const limitedService = new ReportingService(limitedEntries);
            const topIps = limitedService.getTop3MostActiveIps();
            // 192.168.1.1 appears twice, 192.168.1.2 appears once
            expect(topIps).toEqual(['192.168.1.1', '192.168.1.2']);
        });

        it('should return empty array for empty log entries', () => {
            const emptyService = new ReportingService([]);
            expect(emptyService.getTop3MostActiveIps()).toEqual([]);
        });
    });

    describe('getTop3MostVisitedUrls', () => {
        it('should return the top 3 most visited URLs in descending order', () => {
            const topUrls = service.getTop3MostVisitedUrls();
            // /api/users appears 3 times, /api/data appears once
            expect(topUrls).toEqual(['/api/users', '/api/data']);
        });

        it('should return all URLs if there are less than 3 unique URLs', () => {
            const limitedEntries = mockLogEntries.slice(0, 2); // Only 1 unique URL
            const limitedService = new ReportingService(limitedEntries);
            const topUrls = limitedService.getTop3MostVisitedUrls();
            expect(topUrls).toEqual(['/api/users']);
        });

        it('should return empty array for empty log entries', () => {
            const emptyService = new ReportingService([]);
            expect(emptyService.getTop3MostVisitedUrls()).toEqual([]);
        });
    });
});
