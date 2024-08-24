import { Controller, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyDbService } from './property-db.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('property')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly propertyDbService: PropertyDbService,
  ) {}

  /**
   * Endpoint to scrape the property tax table and seed the data into the database.
   * @returns A response indicating the result of the scraping and seeding process.
   */
  @ApiTags('Property Taxes Paid as a Percentage of Owner-Occupied Housing Value, 2021')
  @Post('scrape-and-seed')
  async scrapeAndSeed() {
    try {
      // Scrape the table from the predefined URL and selector.
      const tableData = await this.propertyService.scrapeTable(
        'https://taxfoundation.org/data/all/state/property-taxes-by-state-county-2023/',
        '#tablepress-58'
    );

      // Seed the scraped table data into the predefined collection.
      await this.propertyDbService.seedTableData(tableData, 'property_taxes_percentage');

      return "Property Taxes Paid as a Percentage Data scraped and seeded successfully"
    } catch (error) {
      return { message: 'Error during scraping and seeding "Property Taxes Paid as a Percentage" process: ' + error.message };
    }
  }
}
