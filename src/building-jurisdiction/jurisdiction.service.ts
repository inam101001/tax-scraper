import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DocumentCollection } from 'arangojs/collection';
import { JurisdictiondbService } from './jurisdictiondb.service';

@Injectable()
export class JurisdictionService {

    constructor(private readonly databaseService: JurisdictiondbService) { }


    /**
 * Scrapes CSV data from the provided URL and saves it to the specified database collection.
 * @param url - The URL of the CSV file to scrape.
 * @param collectionName - The name of the database collection to save the scraped data.
 */
    async scrapeCSVData(url: string, collectionName: string) {
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

            // Get the database collection, create it if it doesn't exist
            const collection: DocumentCollection = await this.databaseService.getCollection(collectionName);

            // Check if the collection exists
            if (!(await collection.exists())) {
                console.log(`Collection ${collectionName} does not exist. Creating collection...`);
                await collection.create({});  // Create collection with default options
                console.log(`Collection ${collectionName} created.`);
            }

            // Insert the scraped data into the collection
            for (const item of data) {
                await collection.save(item);
            }

            console.log(`CSV data from ${url} scraped and saved to ${collectionName}`);
        } catch (error) {
            console.error('Error scraping CSV:', error);
            throw error;
        }
    }
}
