import { ApiTags } from '@nestjs/swagger';
import { JurisdictionService } from './jurisdiction.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class JurisdictionController {
    constructor(private readonly jurisdictionService: JurisdictionService) { }

    @ApiTags('Building Permit Jurisdiction Data')
    @Get('scrape-n-seed')
    async scrapeAndSeed() {
        try {
            await this.jurisdictionService.scrapeCSVData(

                "https://www.shovels.ai/images/jurisdiction_mappings.csv",
                "building_permit_jurisdiction");

            return "Building Permit Jurisdiction Data scraped and seeded successfully";
        } catch (error) {
            return `Error scraping and seeding building permit jurisdiction data: ${error}`;
        }

    }
}
