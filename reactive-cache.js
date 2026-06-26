class ReactiveCache {
    constructor() {
        this.cache = new Map();        // url → data
        this.listeners = new Map();    // url → Set of callbacks
        this.inFlight = new Map();     // url → Promise
        this.timestamps = new Map();   // url → last fetch time
        this.ttl = 5000;               // cache duration (ms)
    }

    // 📡 Subscribe (auto-fetch included)
    subscribe(url, fn) {
        if (!this.listeners.has(url)) {
            this.listeners.set(url, new Set());
        }

        const subs = this.listeners.get(url);
        subs.add(fn);

        // 1. Immediately emit cached data if exists
        if (this.cache.has(url)) {
            fn(this.cache.get(url));
        }

        // 2. Auto fetch if cache is missing or stale
        const now = Date.now();
        const isFresh =
            this.cache.has(url) &&
            this.timestamps.has(url) &&
            now - this.timestamps.get(url) < this.ttl;

        if (!isFresh) {
            this.fetch(url);
        }

        // unsubscribe function
        return () => subs.delete(fn);
    }

    // 🚀 Fetch with caching + deduplication
    async fetch(url) {
        const now = Date.now();

        // 1. return fresh cache if valid
        if (
            this.cache.has(url) &&
            this.timestamps.has(url) &&
            now - this.timestamps.get(url) < this.ttl
        ) {
            return this.cache.get(url);
        }

        // 2. avoid duplicate network calls
        if (this.inFlight.has(url)) {
            return this.inFlight.get(url);
        }

        // 3. create request
        const promise = fetch(url)
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then((data) => {
                // store cache
                this.cache.set(url, data);
                this.timestamps.set(url, Date.now());

                // notify UI
                this.notify(url, data);

                this.inFlight.delete(url);

                return data;
            })
            .catch((err) => {
                this.inFlight.delete(url);
                console.error("Fetch error:", err);
                throw err;
            });

        this.inFlight.set(url, promise);

        return promise;
    }

    // 📢 Notify all subscribers
    notify(url, data) {
        const subs = this.listeners.get(url);

        if (subs) {
            subs.forEach((fn) => fn(data));
        }
    }

    // 🧹 Clear cache
    clear(url) {
        if (url) {
            this.cache.delete(url);
            this.timestamps.delete(url);
        } else {
            this.cache.clear();
            this.timestamps.clear();
        }
    }
}

const reactive_cache = new ReactiveCache();

export default reactive_cache;