import create_element from "../custom-functions/create_element.js";

export default class CustomCoinWidgetAddInfo extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    set add_info_data(data) {
        this._add_info_data = data;
        this.render(data);
    }


    render(data) {
        this.innerHTML = "";
        this.el_add_info = create_element({
            tag: "div", childrens: [
                create_element({ tag: "h2", text: "اطلاعات تکمیلی" })
            ]
        })
        this.appendChild(this.el_add_info);
        this.classList.add("coin-additional-info", "skeleton");
        if (data) {
            this.classList.remove("skeleton");
            this.el_add_info.replaceChildren();
            const ath_span1 = create_element({ tag: "span", text: "بالاترین قیمت" });
            const ath_span2 = create_element({ tag: "span", text: format_number(data.market_data.ath.usd, { currency: true, to_persian: true }) });
            const ath_row = create_element({ tag: "div", class_names: ["coin-description-row"], childrens: [ath_span1, ath_span2] });

            const atl_span1 = create_element({ tag: "span", text: "پایین ترین قیمت" });
            const atl_span2 = create_element({ tag: "span", text: format_number(data.market_data.atl.usd, { currency: true, to_persian: true }) });
            const atl_row = create_element({ tag: "div", class_names: ["coin-description-row"], childrens: [atl_span1, atl_span2] });

            const percent_change_30days = data.market_data.price_change_percentage_30d_in_currency.usd
            const price_percentage_change_30d_span1 = create_element({ tag: "span", text: "درصد تغییرات 30 روز اخیر" })
            const price_percentage_change_30d_span2 = create_element({
                tag: "span",
                class_names: ["ltr"],
                style: { color: percent_change_30days > 0 ? "var(--success)" : "var(--danger)" }
                , text: format_number(percent_change_30days, { to_persian: true }) + "%"
            })
            const price_percentage_change_30d_row =
                create_element({ tag: "div", class_names: ["coin-description-row"], childrens: [price_percentage_change_30d_span1, price_percentage_change_30d_span2] });

            const homepage_span1 = create_element({ tag: "span", text: "وبسایت" });
            const homepage_link = create_element({ tag: "a", attrs: { href: data.links.homepage[0] }, text: data.links.homepage[0] })
            const homepage_span2 = create_element({ tag: "span", childrens: [homepage_link] });
            const homepage_row = create_element({ tag: "div", class_names: ["coin-description-row"], childrens: [homepage_span1, homepage_span2] })

            const whitepaper_span1 = create_element({ tag: "span", text: "وایت پیپر" });
            let whitepaper_span2;
            const whitepaper = data.links.whitepaper ? data.links.whitepaper : "ندارد";
            if (!data.links.whitepaper) {
                whitepaper_span2 = create_element({ tag: "span", text: whitepaper });
            } else {
                const whitepaper_link = create_element({ tag: "a", attrs: { href: data.links.whitepaper }, text: data.links.whitepaper })
                whitepaper_span2 = create_element({ tag: "span", childrens: [whitepaper_link] });
            }
            const whitepaper_row = create_element({ tag: "div", class_names: ["coin-description-row"], childrens: [whitepaper_span1, whitepaper_span2] })

            this.el_add_info.append(ath_row, atl_row, price_percentage_change_30d_row, homepage_row, whitepaper_row);
        }
    }
}