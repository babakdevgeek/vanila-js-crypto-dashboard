import GlobalHeader from "../global-header.js"
import PhoneMenu from "../phone-menu.js";
import Search from "../search.js";
import Theme from "../theme.js";

document.addEventListener("DOMContentLoaded", () => {
    const hlobal_header = new GlobalHeader();
    // phone menu
    const phoneMenu = new PhoneMenu("button-menu-bar", "phone-button-back-menu", "phone-nav-menu");
    const search = new Search(".nav-left form");
    const theme = new Theme("button-theme", "THEME");
})