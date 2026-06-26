import create_element from "../custom-functions/create_element.js";
import { router } from "../index.js";

export default class CustomSearch extends HTMLElement {
    constructor() {
        super();
        this.el_form = create_element({ tag: "form" });
        this.el_search_result = create_element({ tag: "div", class_names: ["search-result"] });
        this.el_input = create_element({ tag: "input" });
        this.el_button = create_element({ tag: "button" });
        this.el_button.innerHTML = "<i class='ri-search-line'></i>";
        this.time_to_req = 750;
        this.timeout = null;
        this.el_form.append(this.el_input, this.el_button, this.el_search_result);
        this.appendChild(this.el_form);
    }

    connectedCallback() {
        this.init_listeners();
    }

    on_clickout(event) {
        if (!this.el_search_result.contains(event.target)) {
            this.el_search_result.style.display = "none";
            this.data = null;
        }
    }

    on_form_submit(event) {
        this.el_button.click();
    }

    on_button_click(event) {
        event.preventDefault();
        if (this.data) {
            const href = t`/coin/his.data[0].id`;

            router.push(href)
        }
        if (!this.data) {
            this.el_input.focus();
        }
    }

    on_input(event) {
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
    }


    init_listeners() {
        document.addEventListener("click", this.on_clickout);

        this.el_form.addEventListener("submit", this.on_form_submit)

        this.el_button.addEventListener("click", this.on_button_click)

        this.el_input.addEventListener("input", this.on_input)
    }

    get_url(id) {
        const path = window.location.pathname;
        let url = `/coin/${id}`;
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
        this.el_search_result.innerHTML = "";
        const el_error_span = create_element("span");
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
            const span1 = create_element({ tag: "span", class_names: ["market-cap-rank"] });
            span1.textContent = d.market_cap_rank;
            const img = create_element({ tag: "img", attrs: { src: d.thumb, alt: d.id, loading: "lazy" } });
            const span2 = create_element({ tag: "span", class_names: ["icon"], childrens: [img] });
            const span3 = create_element({ tag: "span", class_names: ["name"] });
            span3.textContent = `${d.name} ${d.symbol}`;
            const a = create_element({ tag: "a", class_names: ["search-result-item"], attrs: { href: url }, childrens: [span1, span2, span3] });
            return a;
        })
        this.el_search_result.append(...html);

        this.el_search_result.style.display = "flex";
    }


}