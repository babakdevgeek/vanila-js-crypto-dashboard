import TrendingTable from "./trending-table.js";

export default class TrendingCoinsTable extends TrendingTable {
    constructor(wrapper_id) {
        super(wrapper_id)
        this.render()
        this.table_row_click_listener();
    }

    table_row_click_listener() {
        const el_table = this.el_wrapper.querySelector("table");
        el_table.addEventListener("click", event => {
            const tr = event.target.closest("tr");
            const id = tr.dataset.id
            if (id) {
                window.location.href = window.location.origin + `/pages/coin.html?coin=${id}`;
            }
        })
    }

    async render() {
        try {

            const data = await this.get()
            const coins = data.coins;
            const rows = coins.map(({ item }) => `
        <tr data-id="${item.id}">
        <td>
        <img
        loading="lazy"
        src="${item.small}"
        alt="${item.name}"
        />
        </td>
        <td>${item.name}(${item.symbol})</td>
        <td style="${item.data.price_change_percentage_24h.usd < 0 ?
                    "color: var(--danger)" : "color: var(--success)"}">
            ${parseFloat(item.data.price_change_percentage_24h.usd).toFixed(2)}%</td>
            <td>${item.market_cap_rank}</td>
            <td>${this.format_price(item.data.price)}</td>
            <td>${item.data.market_cap}</td>
            <td>
            <img
            loading="lazy"
            src="${item.data.sparkline}"
            alt="نمای ۲۴ ساعته"
            />
            </td>
            </tr>
            `).join("");

            this.show_skeleton(false);
            // this.show_error(false);

            this.el_body.innerHTML = rows

        } catch (e) {
            console.error(e);
            this.show_skeleton(false);
            this.show_error(true);
        }
    }
}

