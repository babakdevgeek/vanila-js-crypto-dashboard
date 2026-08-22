import api_key from "../../constants/api.js";

class GlobalFetch {
    constructor() {
        this.apiUrl = `https://api.coingecko.com/api/v3/global?x_cg_demo_api_key=${api_key}`;
    }

    async get() {
        const data_storage = this.get_storage();
        if (data_storage && Date.now() - data_storage.timestamp < 5000) {
            return data_storage.global_header
        }
        try {
            const response = await fetch(this.apiUrl, { method: "GET" })
            if (!response.ok) {
                throw new Error(response.status, response.statusText)
            }
            const data = await response.json();
            this.save_storage(data)
            this.data = data.data;
            return this.data;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    save_storage(data) {
        localStorage.setItem("GLOBAL_HEADER", JSON.stringify({ global_header: JSON.stringify(data), timestamp: Date.now() }));
    }

    get_storage() {
        return localStorage.getItem("GLOBAL_HEADER");
    }
}

const global_fetch_instance = new GlobalFetch();

export default global_fetch_instance;