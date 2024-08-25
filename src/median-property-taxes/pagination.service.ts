import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PaginationService {
   

    /**
     * Scrapes data from multiple pages of a table, handling pagination.
     * @param url - The URL of the webpage to scrape.
     * @param tableSelector - The selector for the table to scrape.
     * @param nextButtonSelector - The selector for the "Next" button for pagination.
     * @returns An array of arrays where each inner array represents rows of the table on a page.
     */
    async scrapeAllPages(url: string, tableSelector: string, nextButtonSelector: string): Promise<any[]> {
        console.log(`Starting scrape from URL: ${url}`);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { timeout: 0 });
        
        const totalPages: number = 162
        const allTableData: any[] = [];
        let currentPage = 1;

        while (currentPage <= totalPages) {
            console.log(`Scraping page ${currentPage}...`);

            // Scrape table data on the current page
            const tableData = await page.evaluate((tableSelector: string) => {
                console.log('Extracting table data...');
                const rows: any[] = [];
                const headers: string[] = [];
                const table = document.querySelector(tableSelector);
                if (table) {
                    // Get table headers
                    table.querySelectorAll('thead th').forEach(th => {
                        headers.push(th.textContent?.trim() || '');
                    });
                    console.log('Headers:', headers);

                    // Get table rows
                    table.querySelectorAll('tbody tr').forEach(tr => {
                        const rowData: any = {};
                        tr.querySelectorAll('td').forEach((td, index) => {
                            rowData[headers[index]] = td.textContent?.trim() || '';
                        });
                        rows.push(rowData);
                    });
                }
                console.log('Rows:', rows);
                return rows;
            }, tableSelector);

            allTableData.push(...tableData);
            console.log('Data for current page added. Total data length:', allTableData.length);

            if (currentPage < totalPages) {
                console.log('Clicking to load next page...');
                await page.click(nextButtonSelector);
                console.log('Waiting for the next page to load...');

                // Wait for the page to load by waiting for table data to change
                await page.waitForFunction(
                    (tableSelector) => document.querySelector(tableSelector)?.querySelectorAll('tbody tr').length > 0,
                    {},
                    tableSelector
                );

                currentPage++;
            } else {
                console.log('Reached the last page. Exiting...');
                break;
            }
        }

        console.log('Scraping completed. Total data length:', allTableData.length);
        await browser.close();
        return allTableData;
    }
}
