import create_element from "../custom-functions/create_element.js";

export default class CustomCoinWidgetInfo extends HTMLElement {
    constructor() {
        super();
        this._info_data = null;
    }

    connectedCallback() {
        this.render();
    }

    set info_data(data) {
        this._info_data = data;

        this.render(data);
    }

    render(data) {

        this.innerHTML = "";

        this.el_info = create_element({
            tag: "div",
            childrens: [
                create_element({ tag: "h2", text: "اطلاعات کلی" })
            ]
        });

        this.appendChild(this.el_info);
        this.classList.add("coin-info", "skeleton");
        if (!data) return;
        this.classList.remove("skeleton");
        // Coin info header
        const h1 = create_element({ tag: "h1" });
        const img = create_element({ tag: "img" });
        h1.classList.add("coin-name");
        img.src = data.image.small;
        img.loading = "lazy";
        img.alt = `تصویر ارز ${data.name}`;
        h1.appendChild(document.createTextNode(data.name));
        h1.appendChild(img);
        this.el_info.replaceChildren(h1)

        // Coin info body

        const rows_data = {
            marketcap_rank: data.market_cap_rank,
            price: format_number(data.market_data.current_price.usd, { currency: true, to_persian: true, max_decimals: 10 }),
            change_24h: data.market_data.price_change_percentage_24h.toFixed(1),
            change_7day: data.market_data.price_change_percentage_7d.toFixed(1),
            marketcap: format_number(data.market_data.market_cap.usd, { shorten: true, to_persian: true }),
            volume_24h: format_number(data.market_data.total_volume.usd, { shorten: true, to_persian: true }),
            circulating_supply: format_number(data.market_data.circulating_supply, { shorten: true, to_persian: true }),
            total_supply: format_number(data.market_data.total_supply, { shorten: true, to_persian: true }),
            max_supply: data.market_data.max_supply_infinite ? "نامحدود" : format_number(data.market_data.max_supply, { shorten: true, to_persian: true }),
            max_supply_infinite: data.market_data.max_supply_infinite ? "بله" : "خیر",
            fully_diluted_valuation: format_number(data.market_data.fully_diluted_valuation.usd, { shorten: true, to_persian: true }),
        }

        const rows = Object.entries(rows_data).map(([key, value]) => {
            const el_row = create_element({ tag: "div" });
            el_row.classList.add("coin-info-row");
            const el_key = create_element({ tag: "span" });
            const el_value = create_element({ tag: "span" });
            const color = value >= 0 ? "var(--success)" : "var(--danger)";
            switch (key) {
                case "marketcap_rank":
                    el_key.textContent = "رتبه بازار";
                    break;
                case "price":
                    el_key.textContent = "قیمت";
                    break;
                case "change_24h":
                    el_key.textContent = "تغییر 24 ساعته";
                    el_value.style.color = color
                    el_value.style.direction = "ltr";
                    break;
                case "change_7day":
                    el_key.textContent = "تغییر 7 روزه";
                    el_value.style.color = color
                    el_value.style.direction = "ltr";
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

            if (key === "change_24h" || key === "change_7day") {
                el_value.textContent = format_number(value, { to_persian: true }) + " " + "%";
            } else {
                el_value.textContent = value;
            }

            el_row.appendChild(el_key);
            el_row.appendChild(el_value);
            return el_row;
        })
        this.el_info.append(...rows);
    }
}