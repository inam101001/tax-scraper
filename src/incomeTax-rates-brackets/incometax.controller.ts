import { Controller, Post } from '@nestjs/common';
import { IncomeTaxService } from './incometax.service';
import { IncomeTaxDbService } from './incometax-db.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('income-tax')
export class IncomeTaxController {
  constructor(
    private readonly incomeTaxService: IncomeTaxService,
    private readonly incomeTaxDbService: IncomeTaxDbService,
  ) {}

  /**
   * Endpoint to scrape the income tax rates and brackets table and seed the data into the database.
   * @returns A response indicating the result of the scraping and seeding process.
   */
  @ApiTags('State Individual Income Tax Rates and Brackets, as of January 1, 2024')
  @Post('scrape-and-seed')
  async scrapeAndSeed() {
    try {
      // Scrape the table from the predefined URL and selector.
      const tableData = await this.incomeTaxService.scrapeTable(
        'https://taxfoundation.org/data/all/state/state-income-tax-rates-2024/',
        '#tablepress-320'
      );

      // Seed the scraped table data into the predefined collection.
      await this.incomeTaxDbService.seedTableData(tableData, 'state_individual_income_tax_rates_brackets');

      return "Income Tax Rates and Brackets Data scraped and seeded successfully";
    } catch (error) {
      return { message: 'Error during scraping and seeding Income Tax Rates and Brackets process: ' + error.message };
    }
  }
}
