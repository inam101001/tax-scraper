import { ApiTags } from '@nestjs/swagger';
import { JurisdictionService } from './jurisdiction.service';
import { JurisdictiondbService } from './jurisdiction-db.service';
import { Controller, Post } from '@nestjs/common';

@Controller('jurisdiction')
export class JurisdictionController {
    constructor(
        private readonly jurisdictionService: JurisdictionService,
        private readonly databaseService: JurisdictiondbService,
    ) { }

    @ApiTags('The list of every building permit jurisdiction in the US')
    @Post('scrape-n-seed')
    async scrapeAndSeed() {
        try {
            // Scrape data from the CSV file
            const data = await this.jurisdictionService.scrapeCSVData(
                "https://www.shovels.ai/images/jurisdiction_mappings.csv",
            );

            // Save the scraped data to the database
            await this.databaseService.saveDataToCollection(data, "building_permit_jurisdiction");

            return "Building Permit Jurisdiction Data scraped and seeded successfully";
        } catch (error) {
            return `Error scraping and seeding building permit jurisdiction data: ${error}`;
        }
    }
}
