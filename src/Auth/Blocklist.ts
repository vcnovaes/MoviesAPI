import { Queue } from "queue-typescript"


// singleton
export default class Blocklist {
    private list;
    private order;
    private static blocklist: Blocklist;
    private constructor() {
        this.list = new Set<string>();
        this.order = new Queue<string>();
    }
    public static createBlocklist() {
        if (!Blocklist.blocklist) {
            Blocklist.blocklist = new Blocklist()
        }
        return Blocklist.blocklist;
    }

    has(token: string) {
        return this.list.has(token)
    }
    removeLast() {
        if (this.list.size === 0) return;
        const lastElement = this.order.tail;
        this.list.delete(lastElement)
        this.order.dequeue()
    }
    add(token: string) {
        this.list.add(token)
        this.order.enqueue(token)
    }
}