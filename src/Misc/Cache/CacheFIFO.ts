import { Queue } from "queue-typescript";

export abstract class CacheFIFO {
    private order: Queue<any> | undefined;

    remove() { }
}