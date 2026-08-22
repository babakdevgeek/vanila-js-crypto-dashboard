import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js";

export default class CustomCategoriesTable extends CustomTable {
    constructor() {
        super();
        this.sort_key = null;
        this.sort_direction = "asc";
        this.on_table_click = this.on_table_click.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();

        this.render();
        this.unsubscribe = reactive_cache.subscribe(`https://api.coingecko.com/api/v3/coins/categories?order=market_cap_desc&x_cg_demo_api_key=${api_key}`, (data) => {
            this.turn_off_loading();
            this.render(data);
        });
        this.el_table.addEventListener("click", this.on_table_click);
    }

    disconnectedCallback() {
        this.unsubscribe?.();
        this.el_table.removeEventListener("click", this.on_table_click);
    }

    on_table_click(event) {
        const sort_button = event.target.closest("button[data-sort]");
        if (!sort_button) return;
        const key = sort_button.dataset.sort;
        this.sort_direction = this.sort_key === key && this.sort_direction === "asc" ? "desc" : "asc";
        this.sort_key = key;
        this.render(this.data);
    }

    sorted_categories(categories) {
        if (!this.sort_key) return categories;
        const direction = this.sort_direction === "asc" ? 1 : -1;
        return [...categories].sort((a, b) => {
            const values = (category) => ({
                name: category.name,
                updated_at: new Date(category.updated_at || 0).getTime(),
                change: category.market_cap_change_24h,
                market_cap: category.market_cap,
                volume: category.volume_24h
            })[this.sort_key];
            const left = values(a);
            const right = values(b);
            if (typeof left === "string") return left.localeCompare(right) * direction;
            return ((left ?? -Infinity) - (right ?? -Infinity)) * direction;
        });
    }

    render(data) {
        this.data = data || this.data;
        this.el_thead.innerHTML = "";
        this.el_body.innerHTML = "";
        const th_list = [["سه ارز اصلی"], ["نام", "name"], ["آخرین بروزرسانی", "updated_at"], ["درصد تغییرات مارکت کپ (۲۴ ساعت)", "change"], ["مارکت کپ", "market_cap"], ["حجم کلی", "volume"]];
        const tr_th = create_element({ tag: "tr" });
        th_list.forEach(([label, key]) => {
            const active = this.sort_key === key;
            const el_th = create_element({ tag: "th", attrs: key ? { "aria-sort": active ? (this.sort_direction === "asc" ? "ascending" : "descending") : "none" } : undefined });
            if (key) {
                el_th.append(create_element({ tag: "button", class_names: ["sort-control"], attrs: { type: "button", "data-sort": key }, text: `${label} ${active ? (this.sort_direction === "asc" ? "↑" : "↓") : "↕"}` }));
            } else {
                el_th.textContent = label;
            }
            tr_th.appendChild(el_th);
        });
        this.el_thead.appendChild(tr_th);

        if (this.data) {

            this.sorted_categories(this.data.slice(0, 15)).map((category) => {

                const tr_data = create_element({
                    tag: "tr", attrs: { "data-id": category.id }, childrens: [
                        create_element({
                            tag: "td", childrens: [
                                ...(category.top_3_coins || []).map((src, index) => create_element({ tag: "img", attrs: { loading: "lazy", src, alt: `${category.name} عکس ${index + 1}` } })),
                            ]
                        }),
                        create_element({ tag: "td", text: `${category.name}` }),

                        create_element({ tag: "td", text: category.updated_at ? new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date(category.updated_at)) : "—" }),

                        create_element({ tag: "td", class_names: ["ltr", category.market_cap_change_24h > 0 ? "success" : "danger"], text: format_number(category.market_cap_change_24h, { max_decimals: 2, to_persian: true }) + " %" }),


                        create_element({ tag: "td", text: format_number(category.market_cap, { shorten: true, currency: true, to_persian: true }) }),
                        create_element({ tag: "td", text: format_number(category.volume_24h, { shorten: true, currency: true, to_persian: true }) }),

                    ]
                })
                this.el_body.append(tr_data);
            })
        }
    }
}
