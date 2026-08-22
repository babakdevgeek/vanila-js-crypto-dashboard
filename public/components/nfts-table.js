import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js";

export default class CustomNftTable extends CustomTable {
    constructor() {
        super();
        this.unsubscribe = null;
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
        this.on_table_row_click(event, "nft");
    }

    sorted_nfts(nfts) {
        if (!this.sort_key) return nfts;
        const direction = this.sort_direction === "asc" ? 1 : -1;
        return [...nfts].sort((a, b) => {
            const values = (nft) => ({
                name: nft.name,
                change: nft.floor_price_24h_percentage_change,
                currency: nft.native_currency_symbol,
                floor_price: nft.data.floor_price,
                volume: nft.data.h24_volume,
                average_sale: nft.data.h24_average_sale_price
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
        const th_list = [
            ["آیکون"], ["نام", "name"], ["درصد تغییرات کف قیمت (۲۴ ساعت)", "change"], ["ارز بومی", "currency"],
            ["ارزان ترین", "floor_price"], ["حجم (۲۴ ساعت)", "volume"], ["میانگین فروش (۲۴ ساعت)", "average_sale"], ["نمای ۲۴ ساعته"]
        ];
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

            this.sorted_nfts(this.data.nfts).map((nft) => {

                const tr_data = create_element({
                    tag: "tr", attrs: { "data-id": nft.id }, childrens: [
                        create_element({
                            tag: "td", childrens: [
                                create_element({ tag: "img", attrs: { loading: "lazy", src: nft.thumb, alt: nft.name } })
                            ]
                        }),
                        create_element({ tag: "td", text: `${nft.name}(${nft.symbol})` }),

                        create_element({ tag: "td", class_names: ["ltr", nft.floor_price_24h_percentage_change > 0 ? "success" : "danger"], text: format_number(nft.floor_price_24h_percentage_change, { max_decimal: 2, to_persian: true }) + " %" }),

                        create_element({ tag: "td", text: nft.native_currency_symbol }),

                        create_element({ tag: "td", text: nft.data.floor_price }),
                        create_element({ tag: "td", text: nft.data.h24_volume }),
                        create_element({ tag: "td", text: nft.data.h24_average_sale_price }),

                        create_element({
                            tag: "td", childrens: [
                                create_element({ tag: "img", attrs: { src: nft.data.sparkline, loading: "lazy", alt: nft.name + " چارت" } })
                            ]
                        }),
                    ]
                })
                this.el_body.append(tr_data);
            })
        }
    }
}
