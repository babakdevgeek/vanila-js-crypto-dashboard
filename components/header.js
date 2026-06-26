import create_element from "../custom-functions/create_element.js"
import reactive_cache from "../reactive-cache.js"

export default class CustomHeader extends HTMLElement {
    constructor() {
        super()
    }


    connectedCallback() {
        this.render()
        reactive_cache.subscribe("https://api.coingecko.com/api/v3/global?x_cg_demo_api_key=CG-xQk882M4x6x2sEL32z5gJyjR", (data) => {
            this.render(data.data);
        })
    }

    render(data) {
        this.replaceChildren();
        const coins = data?.active_cryptocurrencies;
        const market_cap = data?.total_market_cap?.usd
        const change = data?.market_cap_change_percentage_24h_usd;
        const el_header = create_element({
            tag: "header", childrens: [
                create_element({
                    tag: "div", class_names: ["global"], childrens: [
                        create_element({
                            tag: "div", class_names: ["container"], childrens: [
                                create_element({
                                    tag: "div", id: "count-coins", text: "ارزها: ", childrens: [
                                        create_element({ tag: "b", text: coins ?? "N/A" })
                                    ]
                                }),
                                create_element({
                                    tag: "div", id: "market-cap", text: "مارکت کپ: ", childrens: [
                                        create_element({ tag: "b", text: market_cap == undefined ? "N/A" : format_number(market_cap, { shorten: true, to_persian: true }) })
                                    ]
                                }),
                                create_element({
                                    tag: "div", id: "market-change", text: "تغییرات بازار: ", childrens: [
                                        create_element({
                                            class_names: [
                                                change == undefined ? undefined : change > 0 ? "success" : "danger"
                                            ], tag: "b", text: change == undefined ? "N/A" : "% " + format_number(change, { max_decimal: 2 })
                                        })
                                    ]
                                }),
                            ]
                        })

                    ]
                }),
                create_element({
                    tag: "div", id: "container-navEl", childrens: [
                        create_element({
                            tag: "nav", childrens: [
                                create_element({
                                    tag: "div", class_names: ["nav-right"], childrens: [
                                        create_element({ tag: "a", id: "link-logo", attrs: { href: "/", "data-spa": true }, text: "لوگو." }),
                                        create_element({
                                            tag: "ul", childrens: [
                                                create_element({
                                                    tag: "li", id: "li-home", childrens: [
                                                        create_element({ tag: "a", attrs: { href: "/", "data-spa": true }, text: "صفحه اصلی" })
                                                    ]
                                                }),
                                                create_element({
                                                    tag: "li", id: "li-chart", childrens: [
                                                        create_element({ tag: "a", attrs: { href: "/chart", "data-spa": true }, text: "چارت" })
                                                    ]
                                                }),
                                                create_element({
                                                    tag: "li", id: "li-about", childrens: [
                                                        create_element({ tag: "a", attrs: { href: "/about", "data-spa": true }, text: "درباره ی ما" })
                                                    ]
                                                }),
                                            ]
                                        })
                                    ]
                                }),
                                create_element({
                                    tag: "div", class_names: ["nav-left"], childrens: [
                                        create_element({
                                            tag: "custom-search-bar"
                                        }),
                                        create_element({
                                            tag: "div", class_names: ["nav-left-wrapper-buttons"], childrens: [
                                                create_element({
                                                    tag: "custom-theme-button"
                                                }),
                                                create_element({
                                                    tag: "custom-phone-menu"
                                                }),
                                            ]
                                        })
                                    ]
                                }),

                            ]
                        })
                    ]
                })
            ]
        })


        this.appendChild(el_header);
    }
}