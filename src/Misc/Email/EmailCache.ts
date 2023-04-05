import { Queue } from "queue-typescript"
import { CacheFIFO } from "../Cache/CacheFIFO"

export class EmailCache {
    private emailCode
    private order
    private static emailCache: EmailCache

    private constructor() {
        this.emailCode = new Map<string, string>()
        this.order = new Queue<string>()
    }
    public static create() {
        if (!EmailCache.emailCache) {
            EmailCache.emailCache = new EmailCache()
        }
        return EmailCache.emailCache
    }

    remove() {
        if (this.order.length === 0) return;
        const toBeRemoved = this.order.head
        this.emailCode.delete(toBeRemoved)
        this.order.dequeue()

    }
    add(email: string, code: string): void {
        this.emailCode.set(email, code)
    }

    compare(email: string, code: string) {
        return this.emailCode.get(email) === code
    }


}