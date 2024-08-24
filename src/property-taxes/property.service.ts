import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PropertyService {
  /**
   * Scrapes a table from the provided URL and selector.
   * @param url - The URL of the webpage to scrape.
   * @param selector - The CSS selector for the table to scrape.
   * @returns A promise that resolves to an array of objects representing rows in the table.
   */
  async scrapeTable(url: string, selector: string): Promise<any[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const tableData = await page.evaluate((sel) => {
      const table = document.querySelector(sel);
      if (!table) return [];

      const headers: string[] = [];
      const rows: any[] = [];

      table.querySelectorAll('thead th').forEach((header: HTMLTableHeaderCellElement) => {
        headers.push(header.textContent?.trim() || '');
      });

      table.querySelectorAll('tbody tr').forEach((row: HTMLTableRowElement) => {
        const rowData: any = {};
        row.querySelectorAll('td').forEach((cell: HTMLTableCellElement, index: number) => {
          if (headers[index]) {
            rowData[headers[index]] = cell.textContent?.trim() || '';
          }
        });
        rows.push(rowData);
      });

      return rows;
    }, selector);

    await browser.close();

    return tableData;
  }
}
