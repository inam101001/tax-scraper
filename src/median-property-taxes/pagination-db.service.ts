import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';

@Injectable()
export class PaginationDbService {
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
  async storeTableData(tableData: any[], collectionName: string): Promise<string> {
    const collection = this.db.collection(collectionName);

    if (!(await collection.exists())) {
      await collection.create();
    }

    for (const row of tableData) {
      const { County, State, ...rest } = row;
      //const documentKey = `${County}_${State}`;
      const existingCursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc.County == ${County} AND doc.State == ${State}
        RETURN doc
      `);
      const existingDocs = await existingCursor.all();

      if (existingDocs.length > 0) {
        const existingDoc = existingDocs[0];
        if (JSON.stringify(existingDoc) !== JSON.stringify({ County, State, ...rest })) {
          await collection.update(existingDoc._key, { County, State, ...rest });
        }
      } else {
        await collection.save({ County, State, ...rest });
      }
    }

    return 'Seeding process completed successfully.';
  }
}
