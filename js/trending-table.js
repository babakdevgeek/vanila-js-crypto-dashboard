import api_key from "../constants/api.js";

export default class TrendingTable {
    constructor(wrapper_id) {
        this.apiUrl = `https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${api_key}`
        this.el_wrapper = document.getElementById(wrapper_id);
        this.el_body = this.el_wrapper.querySelector("tbody");
        this.el_retry_button = this.el_wrapper.querySelector(".retry-button")
        this.init_listeners();

    }

    init_listeners() {
        this.el_retry_button.addEventListener("click", () => this.retry())
    }

    format_price(price) {
        const formatter = new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 8,
            minimumFractionDigits: 0,
            currency: "USD",
            style: "currency"
        })

        const edited_value = formatter.format(price);
        return edited_value;
    }

    async retry() {
        this.show_error(false);
        this.show_skeleton(true)
        await this.render()
    }

    save_storage(data) {
        localStorage.setItem("TRENDING", { trending: JSON.stringify(data), timestamp: Date.now() });
    }

    get_storage() {
        return localStorage.getItem("TRENDING");
    }


    async get() {
        const data_storage = this.get_storage();
        if (data_storage && Date.now() - data_storage.timestamp < 5000) {

            return data_storage.trending;
        }
        else {
            const response = await fetch(this.apiUrl, { method: "GET" })
            const data = await response.json();
            this.data = data;
            this.save_storage(data);
            return this.data;
        }
    }

    show_error(show) {
        if (!show) {
            this.el_wrapper.classList.remove("show-error")
        }
        if (show) {
            this.el_wrapper.classList.add("show-error")
        }
    }

    show_skeleton(show) {
        if (!show) {
            this.el_wrapper.classList.remove("skeleton")
        }

        if (show) {
            this.el_wrapper.classList.add("skeleton")
        }
    }
}