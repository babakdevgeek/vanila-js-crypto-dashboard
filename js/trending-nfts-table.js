import TrendingTable from "./trending-table.js";

export default class TrendingNftsTable extends TrendingTable {
    constructor(wrapper_id) {
        super(wrapper_id)
        this.render();
    }
    async render() {
        try {

            const data = await this.get()
            const nfts = data.nfts;
            const rows = nfts.map((item) => `
         <tr>
                  <td>
                    <img
                      loading="lazy"
                      src="${item.thumb}"
                      alt="${item.name}"
                    />
                  </td>
                  <td>${item.name}(${item.symbol})</td>
                  <td style="${item.data.floor_price_in_usd_24h_percentage_change < 0 ?
                    "color: var(--danger)" : "color: var(--success)"}">
            ${parseFloat(item.data.floor_price_in_usd_24h_percentage_change).toFixed(2)}%</td>
            <td>${item.data.h24_volume}</td>
            <td>${item.data.floor_price}</td>
                  <td>${item.data.h24_average_sale_price}</td>
                  <td><img
                      loading="lazy"
                      src="${item.data.sparkline}"
                      alt="نمای 24 ساعته"
                    /></td>
                    
                </tr>
            `).join("");

            this.show_skeleton(false);
            this.show_error(false);

            this.el_body.innerHTML = rows

        } catch (e) {
            console.error(e);
            this.show_skeleton(false);
            this.show_error(true);
        }
    }

}