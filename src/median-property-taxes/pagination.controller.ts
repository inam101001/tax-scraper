import { Controller, Post } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { PaginationDbService } from './pagination-db.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('pagination')
export class PaginationController {

  constructor(
    private readonly paginationService: PaginationService,
    private readonly paginationDbService: PaginationDbService,
  ) {}

  /**
   * Endpoint to scrape data from multiple pages and store it in the database.
   * @returns A response indicating the result of the scraping and storage process.
   */
  @ApiTags('Median Property Taxes Paid by County, 2021 (5-year estimate)')
  @Post('scrape-and-store')
  async scrapeAndStore() {
    try {
      // Scrape data from all pages
      const tableData = await this.paginationService.scrapeAllPages(
        'https://taxfoundation.org/data/all/state/property-taxes-by-state-county-2023/',
        '#tablepress-57',
        '#tablepress-57_next'
      );

      // Store the scraped data into the database
      const result = await this.paginationDbService.storeTableData(tableData, 'median_property_taxes_by_state_county_2021');

      return { message: result };
    } catch (error) {
      return { message: 'Error during scraping and storage process: ' + error.message };
    }
  }
}
