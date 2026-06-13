import api_key from "../constants/api.js";
import create_element from "./helpers/create-element.js";
import Theme from "./theme.js";

export default class Coin {
    constructor(query) {
        this.apiUrl = `https://api.coingecko.com/api/v3/coins/${query}?x_cg_demo_api_key=${api_key}`

        const el_coin = document.querySelector(".coin");
        this.el_info = el_coin.querySelector(".coin-info");
        this.el_chart = el_coin.querySelector(".coin-chart");
        this.el_description = el_coin.querySelector(".coin-description");
        this.el_additional_info = el_coin.querySelector(".coin-additional-info");
        this.elchart_container = this.el_chart.querySelector(".coin-chart-container");

        this.render();
    }

    async get() {
        try {
            const response = await fetch(this.apiUrl, { method: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    format(data, type) {
        if (Number.isNaN(Number(data))) {
            return undefined;
        }
        if (type === "currency") {
            const formatter = new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 8,
                minimumFractionDigits: 0,
                currency: "USD",
                style: "currency"
            })
            return formatter.format(data);
        }
        if (type === "percent") {
            const formatter = new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
                style: "percent"
            })
            return formatter.format(data / 100);
        }
        return undefined;
    }

    render_info(data) {

        // Coin info header
        const h1 = document.createElement("h1");
        const img = document.createElement("img");
        h1.classList.add("coin-name");
        img.src = data.image.small;
        img.alt = `تصویر ارز ${data.name}`;
        h1.appendChild(document.createTextNode(data.name));
        h1.appendChild(img);
        this.el_info.replaceChildren(h1)

        // Coin info body
        const rows_data = {
            marketcap_rank: data.market_cap_rank,
            price: this.format(data.market_data.current_price.usd, "currency"),
            change_24h: this.format(data.market_data.price_change_percentage_24h, "percent"),
            change_7day: this.format(data.market_data.price_change_percentage_7d, "percent"),
            marketcap: this.format(data.market_data.market_cap.usd, "currency"),
            volume_24h: this.format(data.market_data.total_volume.usd, "currency"),
            circulating_supply: this.format(data.market_data.circulating_supply, "currency"),
            total_supply: this.format(data.market_data.total_supply, "currency"),
            max_supply: data.market_data.max_supply_infinite ? "نامحدود" : this.format(data.market_data.max_supply, "currency"),
            max_supply_infinite: data.market_data.max_supply_infinite ? "بله" : "خیر",
            fully_diluted_valuation: this.format(data.market_data.fully_diluted_valuation.usd, "currency"),
        }

        const rows = Object.entries(rows_data).map(([key, value]) => {
            const el_row = document.createElement("div");
            el_row.classList.add("coin-info-row");
            const el_key = document.createElement("span");
            const el_value = document.createElement("span");
            switch (key) {
                case "marketcap_rank":
                    el_key.textContent = "رتبه بازار";
                    break;
                case "price":
                    el_key.textContent = "قیمت";
                    break;
                case "change_24h":
                    el_key.textContent = "تغییر 24 ساعته";
                    break;
                case "change_7day":
                    el_key.textContent = "تغییر 7 روزه";
                    break;
                case "marketcap":
                    el_key.textContent = "مارکت کپ";
                    break;
                case "volume_24h":
                    el_key.textContent = "حجم 24 ساعته";
                    break;
                case "circulating_supply":
                    el_key.textContent = "عرضه در گردش";
                    break;
                case "total_supply":
                    el_key.textContent = "عرضه کل";
                    break;
                case "max_supply":
                    el_key.textContent = "سقف عرضه";
                    el_value.style.color = value == "نامحدود" ? "var(--danger)" : "inherit";
                    break;
                case "fully_diluted_valuation":
                    el_key.textContent = "ارزش کلی بازار"
                    break;
                case "max_supply_infinite":
                    el_key.textContent = "سقف نامحدود؟";
                    el_value.style.color = value == "خیر" ? "var(--success)" : "var(--danger)";
                    break;
            }
            el_value.textContent = value;
            el_row.appendChild(el_key);
            el_row.appendChild(el_value);
            return el_row;
        })
        this.el_info.append(...rows);
        this.remove_skeleton_class(this.el_info);
    }

    render_additional_info(data) {
        this.el_additional_info.replaceChildren();
        const ath_span1 = create_element("span", null, null, "بالاترین قیمت");
        const ath_span2 = create_element("span", null, null, this.format(data.market_data.ath.usd, "currency"));
        const ath_row = create_element("div", ["coin-description-row"], null, null, [ath_span1, ath_span2]);

        const atl_span1 = create_element("span", null, null, "پایین ترین قیمت");
        const atl_span2 = create_element("span", null, null, this.format(data.market_data.atl.usd, "currency"));
        const atl_row = create_element("div", ["coin-description-row"], null, null, [atl_span1, atl_span2]);


        const price_percentage_change_30d_span1 = create_element("span", null, null, "درصد تغییرات 30 روز اخیر")
        const price_percentage_change_30d_span2 = create_element("span", null, null, this.format(data.market_data.price_change_percentage_30d_in_currency.usd, "percent"))
        const price_percentage_change_30d_row =
            create_element("div", ["coin-description-row"], null, null, [price_percentage_change_30d_span1, price_percentage_change_30d_span2]);

        const homepage_span1 = create_element("span", null, null, "وبسایت");
        const homepage_link = create_element("a", null, { href: data.links.homepage[0] }, data.links.homepage[0])
        const homepage_span2 = create_element("span", null, null, null, [homepage_link]);
        const homepage_row = create_element("div", ["coin-description-row"], null, null, [homepage_span1, homepage_span2])

        const whitepaper_span1 = create_element("span", null, null, "وایت پیپر");
        let whitepaper_span2;
        const whitepaper = data.links.whitepaper ? data.links.whitepaper : "ندارد";
        if (!data.links.whitepaper) {
            whitepaper_span2 = create_element("span", null, null, whitepaper);
        } else {
            const whitepaper_link = create_element("a", null, { href: data.links.whitepaper }, data.links.whitepaper)
            whitepaper_span2 = create_element("span", null, null, null, [whitepaper_link]);
        }
        const whitepaper_row = create_element("div", ["coin-description-row"], null, null, [whitepaper_span1, whitepaper_span2])

        this.el_additional_info.append(ath_row, atl_row, price_percentage_change_30d_row, homepage_row, whitepaper_row);
        this.remove_skeleton_class(this.el_additional_info);

    }

    refresh_chart() {
        if (this.el_custom) {
            this.el_custom.setAttribute("theme", Theme.get_theme_static())
        }
    }

    render_chart(data) {
        const symbol = data.symbol.toUpperCase();
        const name = data.name;
        // Custom element of tradingview
        this.el_custom = document.createElement("tv-mini-chart");
        this.el_custom.setAttribute("symbol", `MEXC:${symbol}USDT`);
        this.el_custom.setAttribute("theme", Theme.get_theme_static());

        // script of tradingview
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://widgets.tradingview-widget.com/w/en/tv-mini-chart.js";
        this.elchart_container.append(script, this.el_custom);

        this.el_chart.querySelector(".coin-chart-top span").textContent = name;
        const button = this.el_chart.querySelector("button");
        button.addEventListener("click", event => {
            window.location.href = window.location.origin + `/pages/chart.html?sym=${data.symbol}`;
        })
        this.remove_skeleton_class(this.el_chart)
    }

    render_description(data) {
        const name = data.name;
        const desc = data.description.en;

        this.el_description.querySelector("b").textContent = name;
        this.el_description.querySelector("p").textContent = desc;
        this.remove_skeleton_class(this.el_description);
    }

    remove_skeleton_class(element) {
        element.classList.remove("skeleton");
    }

    async render() {
        const data = await this.get();
        console.log(data);
        if (!data) return;
        document.title += ` ${data.name}`
        this.render_chart(data);
        this.render_info(data);
        this.render_description(data);
        this.render_additional_info(data);
    }
}