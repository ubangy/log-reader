import { FileReaderService } from "./fileReader.service";
import { ReportingService } from "./reporting.service";

async function main() {
    console.log('Log Reader starting...');

    const fileReaderService = new FileReaderService();
    const logEntries = await fileReaderService.readLogFile();
    console.log("Number of log entries:", logEntries.length);

    const reportingService = new ReportingService(logEntries);
    const numberOfUniqueIps = reportingService.getNumberOfUniqueIps();
    const top3MostVisitedUrls = reportingService.getTop3MostVisitedUrls();
    const top3MostVisitedIps = reportingService.getTop3MostVisitedIps();

    console.log("Number of unique IPs:", numberOfUniqueIps);
    console.log("Top 3 most visited URLs:", top3MostVisitedUrls);
    console.log("Top 3 most visited IPs:", top3MostVisitedIps);
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
}); 