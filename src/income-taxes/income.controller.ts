import { Controller, Post } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeDbService } from './income-db.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('income-taxes')
export class IncomeController {

  constructor(
    private readonly incomeService: IncomeService,
    private readonly incomeDbService: IncomeDbService,
  ) {}

  @ApiTags('2024 State Individual Income Tax Structures')
  @Post('scrape-and-seed')
  async scrapeAndSeed() {
    try {
      // Scrape columns from the predefined URL and selector
      const columns = await this.incomeService.scrapeTable(
        'https://taxfoundation.org/data/all/state/state-income-tax-rates-2024/', 
        '#tablepress-319'
    );

      // Seed the columns into the predefined collection
     const result = await this.incomeDbService.seedTableData(columns, 'state_individual_income_tax_structures');

      return {message:result}
    } catch (error) {
      return { message: 'Error during scraping and seeding process: 2024 State Individual Income Tax Structures' + error.message };
    }
  }
}
