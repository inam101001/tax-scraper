import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';

@Injectable()
export class IncomeTaxDbService {
    private db: Database;

    constructor() {
        this.db = new Database({
            url: 'http://localhost:8560',
            databaseName: 'taxes_db',
            auth: { username: 'inam', password: 'inaminam' },
        });
    }

    /**
     * Seeds the provided table data into a specific collection in ArangoDB.
     * @param tableData - An array of objects where each object represents a row with headers as keys.
     * @param collectionName - The name of the collection to store the data in.
     */
    async seedTableData(tableData: any[], collectionName: string): Promise<string> {
        const collection = this.db.collection(collectionName);

        /*if (!(await collection.exists())) {
          await collection.create();
        }*/
          if (await collection.exists()) {
            console.log("Collection found. Deleting documents...");
            
            // Execute AQL query to remove all documents
            await this.db.query(aql`
                FOR doc IN ${collection}
                REMOVE doc IN ${collection}
            `);
        } else {
            await collection.create();
            console.log("Collection created.");
        }
        

        // Simply store each row of the table data in the collection
        for (const row of tableData) {
            await collection.save({ data: row });
        }

        return 'Seeding process completed successfully.';
    }
}