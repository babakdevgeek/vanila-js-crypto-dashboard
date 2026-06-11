import GlobalHeader from "../global-header.js";
import PhoneMenu from "../phone-menu.js";
import Search from "../search.js";
import Theme from "../theme.js";
import TradingView from "./trading-view.js";

document.addEventListener("DOMContentLoaded", () => {
    const global = new GlobalHeader();

    // phone menu
    const phoneMenu = new PhoneMenu("button-menu-bar", "phone-button-back-menu", "phone-nav-menu");

    const theme = new Theme("button-theme", "THEME");
    const search = new Search(".nav-left form");
    const trading_view = new TradingView(".tradingview-widget-container");

    theme.el_button_theme.addEventListener("click", () => {
        trading_view.refresh_script();
    })
});