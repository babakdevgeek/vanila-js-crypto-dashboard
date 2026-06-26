import CustomAbout from "./components/about.js";
import TradeButton from "./components/button.js";
import CustomCategoriesTable from "./components/categories-table.js";
import CustomCoinWidgetAddInfo from "./components/coin-widget-add-info.js";
import CustomCoinWidgetChart from "./components/coin-widget-chart.js";
import CustomCoinWidgetInfo from "./components/coin-widget-info.js";
import CustomCoinsTable from "./components/coins-table.js";
import CustomCoinWidget from "./components/custom-coin-widget.js";
import CustomCoinWidgetDescription from "./components/custom-widget-description.js";
import CustomFooter from "./components/footer.js";
import CustomHeader from "./components/header.js";
import CustomNftTable from "./components/nfts-table.js";
import CustomPhoneMenu from "./components/phone-menu.js";
import CustomSearchBar from "./components/search-bar.js";
import CustomSearch from "./components/search.js";
import CustomTChart from "./components/t-chart.js";
import CustomTableWidget from "./components/table-widget.js";
import CustomTable from "./components/table.js";
import CustomThemeButton from "./components/theme-button.js";
import about from "./page-components/about.js";
import chart from "./page-components/chart.js";
import coin from "./page-components/coin.js";
import home from "./page-components/home.js";
import Router from "./router.js";
window.format_number = function (
    value,
    {
        currency = false,
        shorten = false,
        locale = "en",
        to_persian = false,
        min_decimals = 0,
        max_decimals = 2
    } = {}
) {
    if (value == null || isNaN(value)) return "";

    let num = Number(value);

    const isNegative = num < 0;
    num = Math.abs(num);

    // ---------------------------
    // SHORT FORMAT (K, M, T)
    // ---------------------------
    const short = (n) => {
        if (n >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
        if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
        if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
        if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
        return n.toString();
    };

    let result;

    // ---------------------------
    // SHORT MODE (ignores decimals control)
    // ---------------------------
    if (shorten) {
        result = short(num);
    } else {
        result = new Intl.NumberFormat(locale, {
            minimumFractionDigits: min_decimals,
            maximumFractionDigits: max_decimals
        }).format(num);
    }

    // ---------------------------
    // CURRENCY
    // ---------------------------
    if (currency) {
        result = "$" + result;
    }

    // ---------------------------
    // NEGATIVE HANDLING
    // ---------------------------
    if (isNegative) {
        result = "-" + result;
    }

    // ---------------------------
    // PERSIAN DIGITS
    // ---------------------------
    if (to_persian) {
        const map = {
            "0": "۰",
            "1": "۱",
            "2": "۲",
            "3": "۳",
            "4": "۴",
            "5": "۵",
            "6": "۶",
            "7": "۷",
            "8": "۸",
            "9": "۹",
            ".": ".",
            ",": ",",
            "-": "-"
        };

        result = result
            .split("")
            .map((c) => map[c] ?? c)
            .join("");
    }

    return result;
};
define_custom_elements();

export const router = new Router([
    {
        path: "/",
        component: home
    },
    {
        path: "/coin/:id",
        component: coin
    },
    {
        path: "/about",
        component: about
    },
    {
        path: "/chart",
        component: chart
    },
    {
        path: "/chart/:id",
        component: chart
    },
]);

window.addEventListener("DOMContentLoaded", e => {

    document.addEventListener("click", e => {
        const link = e.target.closest("a[data-spa]");

        if (!link) return;

        e.preventDefault();
        router.push(link.getAttribute("href"));
    })

})


function define_custom_elements() {
    customElements.define("trade-button", TradeButton);
    customElements.define("custom-table", CustomTable);
    customElements.define("custom-search", CustomSearch);
    customElements.define("custom-header", CustomHeader);
    customElements.define("custom-theme-button", CustomThemeButton);
    customElements.define("custom-search-bar", CustomSearchBar);
    customElements.define("custom-phone-menu", CustomPhoneMenu);
    customElements.define("custom-coins-table", CustomCoinsTable);
    customElements.define("custom-table-widget", CustomTableWidget);
    customElements.define("custom-nfts-table", CustomNftTable);
    customElements.define("custom-categories-table", CustomCategoriesTable);
    customElements.define("custom-footer", CustomFooter);
    customElements.define("custom-t-chart", CustomTChart);
    customElements.define("custom-about", CustomAbout);
    customElements.define("custom-coin-widget", CustomCoinWidget);
    customElements.define("coin-widget-info", CustomCoinWidgetInfo);
    customElements.define("coin-widget-chart", CustomCoinWidgetChart);
    customElements.define("coin-widget-add-info", CustomCoinWidgetAddInfo);
    customElements.define("coin-widget-description", CustomCoinWidgetDescription);
}