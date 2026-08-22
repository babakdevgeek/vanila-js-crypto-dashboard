import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import reactive_cache from "../reactive-cache.js";

const API = "https://api.coingecko.com/api/v3";
const currencies = ["usd", "eur", "gbp", "irr"];
const currencyMark = { usd: "$", eur: "€", gbp: "£", irr: "﷼" };

export default class MarketOverview extends HTMLElement {
    constructor() {
        super();
        this.currency = localStorage.getItem("cg_currency") || "usd";
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
    }

    connectedCallback() {
        this.render();
        this.unsubscribe = reactive_cache.subscribe(
            `${API}/global?x_cg_demo_api_key=${api_key}`,
            (response) => this.render(response.data)
        );
    }

    disconnectedCallback() {
        this.unsubscribe?.();
    }

    onCurrencyChange(event) {
        this.currency = event.target.value;
        localStorage.setItem("cg_currency", this.currency);
        this.render(this.data);
        this.dispatchEvent(new CustomEvent("currencychange", {
            bubbles: true,
            detail: { currency: this.currency }
        }));
    }

    render(data) {
        this.data = data;
        const cap = data?.total_market_cap?.[this.currency];
        const volume = data?.total_volume?.[this.currency];
        const change = data?.market_cap_change_percentage_24h_usd;
        const dominance = data?.market_cap_percentage;
        const currency = this.currency.toUpperCase();
        const stat = (label, value, accent = "") => create_element({
            tag: "div", class_names: accent ? ["market-stat", accent] : ["market-stat"], childrens: [
                create_element({ tag: "span", text: label }),
                create_element({ tag: "strong", class_names: ["ltr"], text: value ?? "—" })
            ]
        });

        this.replaceChildren();
        const select = create_element({ tag: "select", attrs: { "aria-label": "واحد نمایش قیمت" } });
        currencies.forEach((code) => select.append(create_element({
            tag: "option", attrs: code === this.currency ? { value: code, selected: "" } : { value: code }, text: code.toUpperCase()
        })));
        select.addEventListener("change", this.onCurrencyChange);

        const changeText = change == null ? "—" : `${format_number(change, { min_decimals: 2, max_decimals: 2 })}%`;
        const pulse = create_element({
            tag: "section", class_names: !data ? ["market-pulse", "skeleton"] : ["market-pulse"], attrs: { "aria-label": "نبض بازار" }, childrens: [
                create_element({ tag: "div", class_names: ["market-pulse-heading"], childrens: [
                    create_element({ tag: "div", childrens: [
                        create_element({ tag: "p", class_names: ["eyebrow"], text: "COINGECKO · MARKET PULSE" }),
                        create_element({ tag: "h1", text: "نبض بازار کریپتو" })
                    ] }),
                    select
                ] }),
                create_element({ tag: "div", class_names: ["market-stats"], childrens: [
                    stat("ارزش کل بازار", cap == null ? null : `${currencyMark[this.currency]}${format_number(cap, { shorten: true })} ${currency}`),
                    stat("حجم معاملات ۲۴ساعته", volume == null ? null : `${currencyMark[this.currency]}${format_number(volume, { shorten: true })} ${currency}`),
                    stat("تغییر بازار", changeText, change >= 0 ? "positive" : "negative"),
                    stat("دامیننس BTC / ETH", dominance ? `${format_number(dominance.btc, { max_decimals: 1 })}% / ${format_number(dominance.eth, { max_decimals: 1 })}%` : null)
                ] }),
                create_element({ tag: "p", class_names: ["market-pulse-note"], text: data ? `${format_number(data.active_cryptocurrencies, { to_persian: true })} دارایی و ${format_number(data.markets, { to_persian: true })} بازار رصد می‌شود` : "در حال دریافت نمای کلی بازار…" })
            ]
        });
        this.append(pulse);
    }
}
