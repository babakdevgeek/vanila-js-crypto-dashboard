import global_fetch_instance from "./fetch-objects/global-fetch.js";

export default class DominanceChart {
    constructor() {
        this.el_chart_container = document.querySelector(".container-chart");
        this.el_chart = document.querySelector(".container-chart .chart");
        this.el_legend = document.querySelector(".legend");
        this.get_specific().then(x => console.log(x)
        )

        this.render();
    }

    async get_specific() {
        const data = await global_fetch_instance.get()

        if (!data) {
            return undefined;
        }

        const p = data.market_cap_percentage;

        const others = 100 - (p.btc + p.eth + p.usdt + p.bnb + p.usdc + p.sol)
        const final_data = {
            btc: { value: p.btc, color: "#f7931a" },
            eth: { value: p.eth, color: "#627eea" },
            usdt: { value: p.usdt, color: "#26a17b" },
            bnb: { value: p.bnb, color: "#d6f71a" },
            usdc: { value: p.usdc, color: "#1ec4b3" },
            sol: { value: p.sol, color: "#044993" },
            others: { value: others, color: "#888" }
        };
        return final_data;
    }

    async render() {
        const data = await this.get_specific();
        this.el_chart.style.background =
            `conic-gradient(
            ${data.btc.color} 0% ${data.btc.value}%,
            ${data.eth.color} ${data.btc.value}% ${data.btc.value + data.eth.value}%,
            ${data.usdt.color} ${data.btc.value + data.eth.value}% ${data.btc.value + data.eth.value + data.usdt.value}%,
            ${data.bnb.color} ${data.btc.value + data.eth.value + data.usdt.value}% ${data.btc.value + data.eth.value + data.usdt.value + data.bnb.value}%,
            ${data.usdc.color} ${data.btc.value + data.eth.value + data.usdt.value + data.bnb.value}% ${data.btc.value + data.eth.value + data.usdt.value + data.bnb.value + data.usdc.value}%,
            ${data.sol.color} ${data.btc.value + data.eth.value + data.usdt.value + data.bnb.value + data.usdc.value}% ${data.btc.value + data.eth.value + data.usdt.value + data.bnb.value + data.usdc.value + data.sol.value}%,
            ${data.others.color} ${data.btc.value + data.eth.value + data.usdt.value + data.bnb.value + data.usdc.value + data.sol.value}% 100%
        )`;
        this.el_legend.classList.remove("skeleton");
        this.el_legend.innerHTML = `
            <div class="legend-item">
                
            <div class="legend-item-top">
                <span class="btc"></span>
                    BTC 
                </div>

                <div class="legend-item-bottom">
                    ${data.btc.value.toFixed(2)}%
                </div>
            </div>
            
            <div class="legend-item">
                <div class="legend-item-top">
                    <span class="eth"></span>
                    ETH 
                </div>
                <div class="legend-item-bottom">
                    ${data.eth.value.toFixed(2)}%
                </div>
            </div>
            <div class="legend-item">
                <div class="legend-item-top">
                    <span class="usdt"></span>
                    USDT 
                </div>
                <div class="legend-item-bottom">
                    ${data.usdt.value.toFixed(2)}%
                </div>
            </div>
            <div class="legend-item">
                <div class="legend-item-top">
                    <span class="bnb"></span>
                    BNB
                </div>
                <div class="legend-item-bottom">
                    ${data.bnb.value.toFixed(2)}%
                </div>
            </div>
            <div class="legend-item">
                <div class="legend-item-top">
                    <span class="usdc"></span>
                    USDC
                </div>
                <div class="legend-item-bottom">
                    ${data.usdc.value.toFixed(2)}%
                </div>
            </div>
            <div class="legend-item">
                <div class="legend-item-top">
                    <span class="sol"></span>
                    SOL
                </div>
                <div class="legend-item-bottom">
                    ${data.sol.value.toFixed(2)}%
                </div>
            </div>
            <div class="legend-item">
                <div class="legend-item-top">
                    <span class="others"></span>
                    Others
                </div>
                <div class="legend-item-bottom">
                    ${data.others.value.toFixed(2)}%
                </div>
            </div>
        `
    }

}

