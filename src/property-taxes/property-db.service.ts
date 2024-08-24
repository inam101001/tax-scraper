import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';

@Injectable()
export class PropertyDbService {
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

    if (!(await collection.exists())) {
      await collection.create();
    }

    for (const row of tableData) {
      const state = row['State'];
      if (!state) {
        continue; // Skip the row if it doesn't have a 'State' field.
      }

      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc.data.State == ${state}
        RETURN doc
      `);

      const existingDocs = await cursor.all();

      if (existingDocs.length > 0) {
        const existingDoc = existingDocs[0];

        // Compare the existing data with the new data.
        if (JSON.stringify(existingDoc.data) !== JSON.stringify(row)) {
          // Update the existing document if the data has changed.
          await collection.update(existingDoc._key, { data: row });
        }
      } else {
        // Insert new document if the 'State' doesn't exist in the collection.
        await collection.save({ data: row });
      }
    }

    return 'Seeding process completed successfully.';
  }
}
