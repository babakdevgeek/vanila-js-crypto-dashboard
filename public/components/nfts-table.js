import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js";

export default class CustomNftTable extends CustomTable {
    constructor() {
        super();
        this.unsubscribe = null;
    }

    connectedCallback() {
        super.connectedCallback();

        this.render();
        this.unsubscribe = reactive_cache.subscribe(`https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${api_key}`, (data) => {
            this.turn_off_loading();
            this.render(data);
        });
        this.el_table.addEventListener("click", (event, page = "nft") => this.on_table_row_click(event, page))
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = null;
        this.el_table.removeEventListener("click", this.on_table_row_click);
    }

    render(data) {
        this.el_thead.innerHTML = "";
        this.el_body.innerHTML = "";
        const th_list = ["آیکون", "نام", "درصد تغییرات کف قیمت  (۲۴ ساعت)", "ارز بومی", "ارزان ترین", "حجم (۲۴ ساعت)", "کف قیمت(۲۴ ساعت)", "نمای ۲۴ ساعته"];
        const tr_th = create_element({ tag: "tr" });
        th_list.map(th_label => {
            const el_th = create_element({ tag: "th", text: th_label });
            tr_th.appendChild(el_th);
        });
        this.el_thead.appendChild(tr_th);

        if (data) {

            data.nfts.map((nft) => {

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