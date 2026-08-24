import create_element from "../custom-functions/create_element.js";

export default function home(params) {
    document.title = "کوین‌نما | بازار رمزارز"
    const container = create_element({ tag: "div" });

    const overview = create_element({ tag: "market-overview" });
    const btc_live_chart = create_element({tag:"btc-chart-frame"})
    const market_table = create_element({ tag: "market-table" });
    const table_widget = create_element({ tag: "custom-table-widget" });
    overview.addEventListener("currencychange", (event) => market_table.dispatchEvent(new CustomEvent("currencychange", { detail: event.detail })));
    container.append(overview,btc_live_chart, market_table, table_widget);
    return container;
}
