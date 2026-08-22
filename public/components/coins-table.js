import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js"

export default class CustomCoinsTable extends CustomTable {
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.render();
        reactive_cache.subscribe(`https://api.coingecko.com/api/v3/search/trending?x_cg_demo_api_key=${api_key}`, (data) => {
            this.turn_off_loading();
            this.render(data);
        });
        this.el_table.addEventListener("click", (event, page = "coin") => this.on_table_row_click(event, page))
    }

    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = null;
        this.el_table.removeEventListener("click", this.on_table_row_click);
    }



    render(data) {
        this.el_thead.innerHTML = "";
        this.el_body.innerHTML = "";
        const th_list = ["آیکون", "نام", "درصد تغییرات (۲۴ ساعت)", "رتبه", "قیمت", "مارکت کپ", "نمای ۲۴ ساعته"];
        const tr_th = create_element({ tag: "tr" });
        th_list.map(th_label => {
            const el_th = create_element({ tag: "th", text: th_label });
            tr_th.appendChild(el_th);
        });
        this.el_thead.appendChild(tr_th);

        if (data) {

            data.coins.map(({ item }) => {

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

                        create_element({ tag: "td", text: format_number(item.data.price, { max_decimal: 8, currency: true, to_persian: true }) }),


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