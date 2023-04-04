import { Queue } from "queue-typescript";

export default class ActiveList {
    private list;
    private order;
    private static activeList: ActiveList;
    private constructor() {
        this.list = new Map<string, string>();
        this.order = new Queue<string>();
    }
    public static create() {
        if (!ActiveList.activeList) {
            ActiveList.activeList = new ActiveList()
        }
        return ActiveList.activeList;
    }

    remove(token: string) {
        return this.list.delete(token)
    }
    has(token: string) {
        return this.list.has(token)
    }
    getUsername(token: string) {
        return this.list.get(token)
    }
    removeLast() {
        if (this.list.size === 0) return;
        const lastElement = this.order.tail;
        this.list.delete(lastElement)
        this.order.dequeue()
    }
    add(token: string, username: string) {
        this.list.set(token, username)
        this.order.enqueue(token)
    }
}