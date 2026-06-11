import DominanceChart from "./dominance-chart.js";
import GlobalHeader from "./global-header.js";
import PhoneMenu from "./phone-menu.js";
import Search from "./search.js";
import Theme from "./theme.js";
import TrendingCoinsTable from "./trending-coins-table.js";
import TrendingNftsTable from "./trending-nfts-table.js";


document.addEventListener("DOMContentLoaded", () => {
    const global = new GlobalHeader();
    // phone menu
    const phoneMenu = new PhoneMenu("button-menu-bar", "phone-button-back-menu", "phone-nav-menu");

    const theme = new Theme("button-theme", "THEME");
    const trending_coins_table = new TrendingCoinsTable("trending-coins-table-wrapper");
    const trending_nfts_table = new TrendingNftsTable("trending-nfts-table-wrapper");
    const search = new Search(".nav-left form");
    const dominance_chart = new DominanceChart();
});


