import Accordion from "../accordion.js";
import Coin from "../coin.js";
import GlobalHeader from "../global-header.js"
import PhoneMenu from "../phone-menu.js";
import Search from "../search.js";
import Theme from "../theme.js";

document.addEventListener("DOMContentLoaded", () => {
    const hlobal_header = new GlobalHeader();
    // phone menu
    const phoneMenu = new PhoneMenu("button-menu-bar", "phone-button-back-menu", "phone-nav-menu");

    const theme = new Theme("button-theme", "THEME");

    const search = new Search(".nav-left form");
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("coin");

    if (!query) {
        window.location.href = window.location.origin + "/index.html";
    }
    const coin = new Coin(query);

    theme.el_button_theme.addEventListener("click", event => {
        coin.refresh_chart();
    })

    const accordion = new Accordion();
})