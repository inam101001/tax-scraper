import { Injectable } from '@nestjs/common';
import { Database } from 'arangojs';

@Injectable()
export class JurisdictiondbService {
    public db: Database;

    constructor() {
        this.db = new Database({
            url: 'http://localhost:8560',
            databaseName: 'taxes_db',
            auth: {
                username: 'inam',
                password: 'inaminam',
            },
        });
    }

    async saveDataToCollection(data: any[], collectionName: string) {
        const collection = this.db.collection(collectionName);

        // Check if the collection exists
        if (!(await collection.exists())) {
            console.log(`Collection ${collectionName} does not exist. Creating collection...`);
            await collection.create({});  // Create collection with default options
            console.log(`Collection ${collectionName} created.`);
        }

        for (const item of data) {
            const { jurisdiction, state, county } = item;

            // Query the collection to check for an existing entry with the same jurisdiction, state, and county
            const cursor = await this.db.query(`
                FOR doc IN ${collectionName}
                FILTER doc.jurisdiction == @jurisdiction AND doc.state == @state AND doc.county == @county
                RETURN doc
            `, { jurisdiction, state, county });

            const existingEntry = await cursor.next();

            // If no existing entry is found, save the new item
            if (!existingEntry) {
                await collection.save(item);
                console.log(`Entry added: ${jurisdiction}, ${state}, ${county}`);
            } else {
                console.log(`Duplicate entry found for ${jurisdiction}, ${state}, ${county}. Skipping insertion.`);
            }
        }

        console.log(`Data processed and saved to collection ${collectionName} successfully.`);
    }
}
