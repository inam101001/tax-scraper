import { Injectable } from '@nestjs/common';
import { Database, aql } from 'arangojs';

@Injectable()
export class IncomeDbService {
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
   * @param tableData - An array of arrays, each representing a column of data from the table.
   * @param collectionName - The name of the collection to store the data in.
   */
  async seedTableData(tableData: any[], collectionName: string): Promise<string> {
    const collection = this.db.collection(collectionName);

    if (!(await collection.exists())) {
      await collection.create();
    }

    // Define the headers for each column
    const headers = [
      'StatesWithNoIncomeTax',
      'StatesWithFlatIncomeTax',
      'StatesWithGraduatedRateIncomeTax',
    ];

    // Iterate over the headers and table data to create separate documents for each column
    for (let i = 0; i < headers.length; i++) {
      const columnValues = tableData[i] || [];
      const document = { [headers[i]]: columnValues };

      // Check if a document with this column name already exists
      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc._key == ${headers[i]}
        RETURN doc
      `);

      const existingDocs = await cursor.all();

      if (existingDocs.length > 0) {
        // Update existing document if it exists
        await collection.update(existingDocs[0]._key, document);
      } else {
        // Save new document
        await collection.save({ _key: headers[i], ...document });
      }
    }

    return 'Seeding process completed successfully for : 2024 State Individual Income Tax Structures';
  }
}
