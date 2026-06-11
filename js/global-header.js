import global_fetch_instance from "./fetch-objects/global-fetch.js";

export default class GlobalHeader {
    constructor() {
        this.elCountCoins = document.querySelector("#count-coins b");
        this.elCountExchanges = document.querySelector("#count-exchanges b");
        this.elMarketCap = document.querySelector("#market-cap b");
        this.elMarketChange = document.querySelector("#market-change b");
        this.render();
    }



    get_specific(data) {
        const values = {
            numCountCoins: data.active_cryptocurrencies,
            numCountExchanges: data.markets,
            numMarketCap: data.total_market_cap.usd,
            numMarketChange: data.market_cap_change_percentage_24h_usd.toFixed(2)

        }
        return values;
    }



    async render() {
        const formatter = new Intl.NumberFormat("fa-IR", {

        })
        const wholeData = await global_fetch_instance.get()
        if (!wholeData) return;
        const data = this.get_specific(wholeData)
        this.elCountCoins.textContent = formatter.format(parseFloat(data.numCountCoins));
        this.elCountExchanges.textContent = formatter.format(parseFloat(data.numCountExchanges));
        this.elMarketCap.textContent = formatter.format(parseFloat((data.numMarketCap / 1e12).toFixed(3))) + " T";
        this.elMarketChange.textContent = formatter.format(parseFloat(data.numMarketChange)) + "%";
        this.elMarketChange.style.color = data.numMarketChange >= 0 ? "var(--success)" : "var(--danger)";
    }
}