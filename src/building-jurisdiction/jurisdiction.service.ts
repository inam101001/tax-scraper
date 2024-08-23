import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JurisdictionService {
    /**
     * Scrapes CSV data from the provided URL and returns it as an array of objects.
     * @param url - The URL of the CSV file to scrape.
     */
    async scrapeCSVData(url: string): Promise<any[]> {
        try {
            // Fetch the CSV file from the provided URL
            const response = await axios.get(url);
            const csvData = response.data;

            // Split the CSV data into lines and filter out any empty lines
            const lines = csvData.split('\n').filter(line => line.trim() !== '');

            // Extract the headers from the first line
            const headers = lines[0].split(',').map(header => header.trim());

            // Map the remaining lines to objects using the headers as keys
            const data = lines.slice(1).map(line => {
                const values = line.split(',');
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index] ? values[index].trim() : '';
                    return obj;
                }, {});
            });

            console.log(`CSV data from ${url} scraped successfully`);
            return data;
        } catch (error) {
            console.error('Error scraping CSV:', error);
            throw error;
        }
    }
}
