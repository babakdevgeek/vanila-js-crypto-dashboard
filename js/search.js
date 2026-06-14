import api_key from "../constants/api.js";
import create_element from "./helpers/create-element.js";
export default class Search {
    constructor(form_class) {
        this.el_form = document.querySelector(form_class);
        this.el_search_result = document.querySelector(".search-result");
        this.el_input = this.el_form.querySelector("input");
        this.el_button = this.el_form.querySelector("button");
        this.time_to_req = 750;
        this.timeout = null;

        this.init_listeners();
    }

    init_listeners() {
        document.addEventListener("click", event => {
            if (!this.el_search_result.contains(event.target)) {
                this.el_search_result.style.display = "none";
                this.data = null;
            }
        })

        this.el_form.addEventListener("submit", () => {
            this.el_button.click();
        })

        this.el_button.addEventListener("click", (event) => {
            event.preventDefault();
            if (this.data) {
                const url = this.get_url(this.data[0].id);
                console.log(this.data);

                window.location.href = url;
            }
            if (!this.data) {
                this.el_input.focus();
            }
        })
        this.el_input.addEventListener("input", (event) => {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.data = null;
            const query = event.target.value.trim()
            if (!query) {
                this.el_search_result.style.display = "none";
                return;
            };
            this.timeout = setTimeout(() => {
                this.get(query).then(data => {
                    this.data = data;
                    this.render(data);
                })
            }, this.time_to_req)
        })
    }

    get_url(id) {
        const path = window.location.pathname;
        let url = `./pages/coin.html?coin=${id}`;

        if (path.includes("/pages/")) {
            url = `./coin.html?coin=${id}`
        }

        return url;
    }


    async get(query) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/search?x_cg_demo_api_key${api_key}&query=${query}`, {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return data.coins.slice(0, 5);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    render_no_results_found(type) {
        console.log("before switch");
        this.el_search_result.innerHTML = "";
        const el_error_span = document.createElement("span");
        let error_text;

        switch (type) {
            case "u":
                error_text = "جستجو با خطا مواجه شد!"
                break
            case "n":
                error_text = "نتیجه ای یافت نشد!"
                break
        }
        el_error_span.textContent = error_text;
        el_error_span.classList.add("no-result-found");
        this.el_search_result.appendChild(el_error_span);
        this.el_search_result.style.display = "flex";
    }

    async render(data) {
        this.el_search_result.innerHTML = "";

        if (data === undefined) {
            this.render_no_results_found("u")
            return;
        }

        if (!data.length) {
            this.render_no_results_found("n")
            return;
        }

        const html = data.map(d => {
            const url = this.get_url(d.id)
            const span1 = create_element("span", ["market-cap-rank"], null, d.market_cap_rank);
            const img = create_element("img", null, { src: d.thumb, alt: d.id });
            const span2 = create_element("span", ["icon"], null, null, [img]);
            const span3 = create_element("span", ["name"], null, `${d.name} ${d.symbol}`);
            const a = create_element("a", ["search-result-item"], { href: url }, null, [span1, span2, span3]);
            return a;
        })
        console.log(html);
        this.el_search_result.append(...html);

        this.el_search_result.style.display = "flex";
    }


}