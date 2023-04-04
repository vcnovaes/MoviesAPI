import { DatabaseClient } from "../Database/DatabaseClient";

export class Service {
    dbClient: DatabaseClient
    mainTable: string

    constructor(mainTable: string, dbClient: DatabaseClient) {
        this.dbClient = dbClient
        this.mainTable = mainTable
    }
}