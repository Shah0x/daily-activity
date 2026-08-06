// TODO: Refactor key/value to use Generics <K, V> instead of string/any.
// Currently sticking to string/any to get the core logic down first.

class DLLNode {
    key: string;
    val: any;
    prev: DLLNode | null = null;
    next: DLLNode | null = null;

    constructor(key: string, val: any) {
        this.key = key;
        this.val = val;
    }
}

class LRUCache {
    private capacity: number;
    private map: Map<string, DLLNode>;
    private head: DLLNode | null = null;
    private tail: DLLNode | null = null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
    }

    get(key: string): any {
        if (!this.map.has(key)) {
            return -1; // Standard LeetCode default, maybe change to null/undefined later?
        }
        const node = this.map.get(key)!;
        this.moveToHead(node);
        return node.val;
    }

    put(key: string, value: any): void {
        if (this.map.has(key)) {
            const node = this.map.get(key)!;
            node.val = value;
            this.moveToHead(node);
        } else {
            const newNode = new DLLNode(key, value);
            
            if (this.map.size >= this.capacity) {
                // Evict the least recently used (tail)
                if (this.tail) {
                    // console.log(`[DEBUG] Cache full. Evicting tail: ${this.tail.key}`);
                    this.map.delete(this.tail.key);
                    this.removeNode(this.tail);
                }
            }
            
            this.addToHead(newNode);
            this.map.set(key, newNode);
        }
    }

    // --- Linked List Helpers ---

    private addToHead(node: DLLNode): void {
        node.next = this.head;
        node.prev = null;

        if (this.head) {
            this.head.prev = node;
        }
        this.head = node;

        if (!this.tail) {
            this.tail = node;
        }
    }

    private removeNode(node: DLLNode): void {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next; // node was head
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev; // node was tail
        }
    }

    private moveToHead(node: DLLNode): void {
        // Simple but slightly inefficient to remove and re-add. 
        // Works fine for O(1) though since pointers are direct.
        this.removeNode(node);
        this.addToHead(node);
    }
}

// Simple quick verification manual tests
const cache = new LRUCache(2);
cache.put("a", 1);
cache.put("b", 2);
// console.log(cache.get("a")); // Expected: 1
cache.put("c", 3);            // Evicts "b"
// console.log(cache.get("b")); // Expected: -1 (evicted)
cache.put("d", 4);            // Evicts "a"
// console.log(cache.get("a")); // Expected: -1 (evicted)
// console.log(cache.get("c")); // Expected: 3
// console.log(cache.get("d")); // Expected: 4