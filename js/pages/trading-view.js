import Theme from "../theme.js";

export default class TradingView {
    constructor(el_parent_class) {
        this.el_parent = document.querySelector(el_parent_class);
        this.el_parent.innerHTML = "";
        this.el_custom_contaienr = document.getElementById
        this.add_script();
    }

    refresh_script() {
        this.el_parent.innerHTML = "";
        this.add_script();
    }


    add_script() {
        const script = document.createElement('script');
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.async = true;
        const theme = Theme.get_theme_static();

        const searchParams = new URLSearchParams(window.location.search);

        const coin_symbol = searchParams.get("sym");
        document.title += ` ${coin_symbol ? coin_symbol : "btc"}`

        const root = getComputedStyle(document.documentElement);
        const bg = root.getPropertyValue(theme === "light" ? "--td-light-bg-rgb" : "--td-dark-bg-rgb").trim();
        const grid = root.getPropertyValue(theme === "light" ? "--td-light-grid-rgb" : "--td-dark-grid-rgb").trim();
        console.log(`bg is ${bg} & border is ${grid}`);

        const config = {
            "allow_symbol_change": true,
            "calendar": false,
            "details": false,
            "hide_side_toolbar": true,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "hide_volume": false,
            "hotlist": false,
            "interval": "D",
            "locale": "en",
            "save_image": true,
            "style": "1",
            "symbol": coin_symbol ? `MEXC:${coin_symbol.toUpperCase()}USDT` : "MEXC:BTCUSDT",
            "theme": theme,
            "timezone": "Asia/Tehran",
            "backgroundColor": bg,
            "gridColor": grid,
            "watchlist": [],
            "withdateranges": false,
            "compareSymbols": [],
            "studies": [],
            "autosize": true
        }

        script.innerHTML = JSON.stringify(config);
        const el_widget_div = document.createElement("div");
        el_widget_div.classList.add("tradingview-widget-container__widget")
        el_widget_div.style.width = "100%";
        el_widget_div.style.height = "calc(100% - 32px)";
        el_widget_div.appendChild(script);
        this.el_parent.appendChild(el_widget_div);
    }


}