import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class IncomeService {
  /**
   * Scrapes columns from the provided URL and returns them as arrays of values.
   * @param url - The URL of the webpage to scrape.
   * @param selector - The selector to identify the table on the webpage.
   * @returns A promise that resolves to an array of column values.
   */
  async scrapeTable(url: string, selector: string): Promise<any[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const columns = await page.evaluate((selector) => {
      const table = document.querySelector(selector);
      if (!table) return [];

      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() || '');
      const rows = Array.from(table.querySelectorAll('tbody tr'));

      const data: any[] = [];
      headers.forEach(() => data.push([])); // Initialize arrays for each column

      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
          data[index].push(cell.textContent?.trim() || '');
        });
      });

      return data;
    }, selector);

    await browser.close();

    return columns;
  }
}
