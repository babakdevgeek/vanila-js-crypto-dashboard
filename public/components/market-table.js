import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import { format_price } from "../custom-functions/price-format.js";
import reactive_cache from "../reactive-cache.js";
import CustomTable from "./table.js";

const API = "https://api.coingecko.com/api/v3";
const currencyMark = { usd: "$", eur: "€", gbp: "£", irr: "﷼" };

export default class MarketTable extends CustomTable {
    constructor() {
        super();
        this.page = 1;
        this.currency = localStorage.getItem("cg_currency") || "usd";
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onTableClick = this.onTableClick.bind(this);
        this.sortKey = null;
        this.sortDirection = "asc";
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
        this.load();
        this.addEventListener("currencychange", this.onCurrencyChange);
        this.el_table.addEventListener("click", this.onTableClick);
    }

    disconnectedCallback() {
        this.unsubscribe?.();
        this.removeEventListener("currencychange", this.onCurrencyChange);
        this.el_table.removeEventListener("click", this.onTableClick);
    }

    onCurrencyChange(event) {
        this.currency = event.detail.currency;
        this.page = 1;
        this.render();
        this.load();
    }

    onLoadMore() {
        this.page += 1;
        this.load();
    }

    onTableClick(event) {
        const sortButton = event.target.closest("button[data-sort]");
        if (sortButton) {
            const key = sortButton.dataset.sort;
            this.sortDirection = this.sortKey === key && this.sortDirection === "asc" ? "desc" : "asc";
            this.sortKey = key;
            this.render(this.data);
            return;
        }
        this.on_table_row_click(event);
    }

    sortedCoins(coins) {
        if (!this.sortKey) return coins;
        const direction = this.sortDirection === "asc" ? 1 : -1;
        return [...coins].sort((a, b) => {
            const left = this.sortKey === "name" ? a.name : a[this.sortKey];
            const right = this.sortKey === "name" ? b.name : b[this.sortKey];
            if (typeof left === "string") return left.localeCompare(right) * direction;
            return ((left ?? -Infinity) - (right ?? -Infinity)) * direction;
        });
    }

    load() {
        this.unsubscribe?.();
        const url = `${API}/coins/markets?vs_currency=${this.currency}&order=market_cap_desc&per_page=10&page=${this.page}&sparkline=true&price_change_percentage=24h&x_cg_demo_api_key=${api_key}`;
        this.unsubscribe = reactive_cache.subscribe(url, (data) => {
            this.turn_off_loading();
            this.render(data);
        });
    }

    render(data) {
        this.data = data || this.data;
        this.el_thead.replaceChildren();
        this.el_body.replaceChildren();
        const headings = [["رتبه", "market_cap_rank"], ["دارایی", "name"], ["قیمت", "current_price"], ["تغییر ۲۴ساعته", "price_change_percentage_24h"], ["مارکت کپ", "market_cap"], ["حجم ۲۴ساعته", "total_volume"]];
        const headRow = create_element({ tag: "tr" });
        headings.forEach(([label, key]) => {
            const active = this.sortKey === key;
            const heading = create_element({ tag: "th", attrs: { "aria-sort": active ? (this.sortDirection === "asc" ? "ascending" : "descending") : "none" } });
            heading.append(create_element({ tag: "button", class_names: ["sort-control"], attrs: { type: "button", "data-sort": key }, text: `${label} ${active ? (this.sortDirection === "asc" ? "↑" : "↓") : "↕"}` }));
            headRow.append(heading);
        });
        this.el_thead.append(headRow);

        if (Array.isArray(this.data)) {
            this.sortedCoins(this.data).forEach((coin) => {
                const change = coin.price_change_percentage_24h;
                const coinCell = create_element({ tag: "td", class_names: ["market-coin"], childrens: [
                    create_element({ tag: "img", attrs: { src: coin.image, alt: coin.name, loading: "lazy" } }),
                    create_element({ tag: "span", childrens: [
                        create_element({ tag: "b", text: coin.name }),
                        create_element({ tag: "small", class_names: ["ltr"], text: coin.symbol.toUpperCase() })
                    ] })
                ] });
                const row = create_element({ tag: "tr", attrs: { "data-id": coin.id }, childrens: [
                    create_element({ tag: "td", text: format_number(coin.market_cap_rank, { to_persian: true }) }),
                    coinCell,
                    create_element({ tag: "td", class_names: ["ltr"], text: `${currencyMark[this.currency]}${format_price(coin.current_price)}` }),
                    create_element({ tag: "td", class_names: ["ltr", change >= 0 ? "success" : "danger"], text: `${format_number(change, { min_decimals: 2, max_decimals: 2 })}%` }),
                    create_element({ tag: "td", class_names: ["ltr"], text: `${currencyMark[this.currency]}${format_number(coin.market_cap, { shorten: true })}` }),
                    create_element({ tag: "td", class_names: ["ltr"], text: `${currencyMark[this.currency]}${format_number(coin.total_volume, { shorten: true })}` })
                ] });
                this.el_body.append(row);
            });
        }
        this.el_wrapper.classList.toggle("skeleton", !this.data);
        this.loadMoreButton?.remove();
        this.loadMoreButton = create_element({ tag: "button", class_names: ["load-more"], text: "نمایش ۱۰ دارایی بعدی" });
        this.loadMoreButton.addEventListener("click", this.onLoadMore);
        this.append(this.loadMoreButton);
    }
}
