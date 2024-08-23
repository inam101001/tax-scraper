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

    async getCollection(name: string) {
        return this.db.collection(name);
    }
}

