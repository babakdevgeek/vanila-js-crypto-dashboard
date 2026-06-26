import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js";

export default class CustomCategoriesTable extends CustomTable {
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
    }


    render(data) {
        this.el_thead.innerHTML = "";
        this.el_body.innerHTML = "";
        const th_list = ["سه ارز اصلی", "نام", "تعداد ارز", "درصد تغییرات مارکت کپ (۲۴ ساعت)", "مارکت کپ", "حجم کلی"];
        const tr_th = create_element({ tag: "tr" });
        th_list.map(th_label => {
            const el_th = create_element({ tag: "th", text: th_label });
            tr_th.appendChild(el_th);
        });
        this.el_thead.appendChild(tr_th);

        if (data) {

            data.categories.map((category) => {

                const tr_data = create_element({
                    tag: "tr", attrs: { "data-id": category.id }, childrens: [
                        create_element({
                            tag: "td", childrens: [
                                create_element({ tag: "img", attrs: { loading: "lazy", src: category.top_3_coins_images[0], alt: category.name + " عکس اول" } }),
                                create_element({ tag: "img", attrs: { loading: "lazy", src: category.top_3_coins_images[1], alt: category.name + " عکس دوم" } }),
                                create_element({ tag: "img", attrs: { loading: "lazy", src: category.top_3_coins_images[2], alt: category.name + " عکس سوم" } }),
                            ]
                        }),
                        create_element({ tag: "td", text: `${category.name}` }),

                        create_element({ tag: "td", text: category.coins_count }),

                        create_element({ tag: "td", class_names: ["ltr", category.data.market_cap_change_percentage_24h.usd > 0 ? "success" : "danger"], text: format_number(category.data.market_cap_change_percentage_24h.usd, { max_decimal: 2, to_persian: true }) + " %" }),


                        create_element({ tag: "td", text: format_number(category.data.market_cap, { shorten: true, currency: true, to_persian: true }) }),
                        create_element({ tag: "td", text: format_number(category.data.total_volume, { shorten: true, currency: true, to_persian: true }) }),

                    ]
                })
                this.el_body.append(tr_data);
            })
        }
    }
}