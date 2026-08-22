import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import { format_price } from "../custom-functions/price-format.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js"

export default class CustomCoinsTable extends CustomTable {
    constructor() {
        super();
        this.sort_key = null;
        this.sort_direction = "asc";
        this.on_table_click = this.on_table_click.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        this.render();
        this.unsubscribe = reactive_cache.subscribe(`https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${api_key}`, (data) => {
            this.turn_off_loading();
            this.render(data);
        });
        this.el_table.addEventListener("click", this.on_table_click);
    }

    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = null;
        this.el_table.removeEventListener("click", this.on_table_click);
    }

    on_table_click(event) {
        const sort_button = event.target.closest("button[data-sort]");
        if (sort_button) {
            const key = sort_button.dataset.sort;
            this.sort_direction = this.sort_key === key && this.sort_direction === "asc" ? "desc" : "asc";
            this.sort_key = key;
            this.render(this.data);
            return;
        }
        this.on_table_row_click(event, "coin");
    }

    get_sort_value(item, key) {
        const values = {
            name: item.name,
            change: item.data.price_change_percentage_24h.usd,
            rank: item.market_cap_rank,
            price: item.data.price,
            market_cap: item.data.market_cap
        };
        return values[key];
    }

    sorted_coins(coins) {
        if (!this.sort_key) return coins;
        const direction = this.sort_direction === "asc" ? 1 : -1;
        return [...coins].sort(({ item: a }, { item: b }) => {
            const left = this.get_sort_value(a, this.sort_key);
            const right = this.get_sort_value(b, this.sort_key);
            if (typeof left === "string") return left.localeCompare(right) * direction;
            return ((left ?? -Infinity) - (right ?? -Infinity)) * direction;
        });
    }

    render(data) {
        this.data = data || this.data;
        this.el_thead.innerHTML = "";
        this.el_body.innerHTML = "";
        const th_list = [
            ["آیکون"], ["نام", "name"], ["درصد تغییرات (۲۴ ساعت)", "change"], ["رتبه", "rank"],
            ["قیمت", "price"], ["مارکت کپ", "market_cap"], ["نمای ۲۴ ساعته"]
        ];
        const tr_th = create_element({ tag: "tr" });
        th_list.forEach(([label, key]) => {
            const el_th = create_element({ tag: "th", attrs: key ? { "aria-sort": this.sort_key === key ? (this.sort_direction === "asc" ? "ascending" : "descending") : "none" } : undefined });
            if (key) {
                el_th.append(create_element({ tag: "button", class_names: ["sort-control"], attrs: { type: "button", "data-sort": key }, text: `${label} ${this.sort_key === key ? (this.sort_direction === "asc" ? "↑" : "↓") : "↕"}` }));
            } else {
                el_th.textContent = label;
            }
            tr_th.appendChild(el_th);
        });
        this.el_thead.appendChild(tr_th);

        if (this.data) {

            this.sorted_coins(this.data.coins).map(({ item }) => {

                const tr_data = create_element({
                    tag: "tr", attrs: { "data-id": item.id }, childrens: [
                        create_element({
                            tag: "td", childrens: [
                                create_element({ tag: "img", attrs: { loading: "lazy", src: item.small, alt: item.name } })
                            ]
                        }),
                        create_element({ tag: "td", text: `${item.name}(${item.symbol})` }),

                        create_element({ tag: "td", class_names: ["ltr", item.data.price_change_percentage_24h.usd > 0 ? "success" : "danger"], text: format_number(item.data.price_change_percentage_24h.usd, { max_decimal: 2, to_persian: true }) + " %" }),

                        create_element({ tag: "td", text: item.market_cap_rank }),

                        create_element({ tag: "td", class_names: ["ltr"], text: format_price(item.data.price, { currency: true, to_persian: true }) }),


                        create_element({ tag: "td", text: item.data.market_cap }),
                        create_element({
                            tag: "td", childrens: [
                                create_element({ tag: "img", attrs: { src: item.data.sparkline, loading: "lazy", alt: item.name + " چارت" } })
                            ]
                        }),
                    ]
                })
                this.el_body.append(tr_data);
            })
        }
    }
}
