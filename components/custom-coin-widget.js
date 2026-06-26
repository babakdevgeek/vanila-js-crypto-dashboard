import api_key from "../constants/api.js";
import create_element from "../custom-functions/create_element.js";
import { router } from "../index.js";
import reactive_cache from "../reactive-cache.js";

export default class CustomCoinWidget extends HTMLElement {
    constructor() {
        super();
        this.unsubscribe = null
        this.on_data_recieve = this.on_data_recieve.bind(this);
    }

    connectedCallback() {
        this.render();
        const id = this.getAttribute("coin");
        reactive_cache.subscribe(`https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${api_key}`, this.on_data_recieve
        );
    }

    on_data_recieve(data) {
        this.render(data);
    }

    disconnectedCallback() {
        this.unsubscribe?.();
        this.unsubscribe = null;
    }



    // refresh_chart() {
    //     if (this.el_custom) {
    //         this.el_custom.setAttribute("theme", Theme.get_theme_static())
    //     }
    // }



    render_sections(data) {
        document.title = `ارز‍‍` + ` ${data.name}`
        this.el_widget_info.info_data = data;
        this.el_widget_chart.chart_data = data;
        this.el_widget_description.description_data = data;
        this.el_widget_add_info.add_info_data = data;
    }

    render(data) {
        this.el_widget_info = create_element({ tag: "coin-widget-info" });
        this.el_widget_chart = create_element({ tag: "coin-widget-chart" });
        this.el_widget_description = create_element({ tag: "coin-widget-description" });
        this.el_widget_add_info = create_element({ tag: "coin-widget-add-info" });
        this.innerHTML = "";
        this.append(create_element({
            tag: "div", class_names: ["coin"], childrens: [
                // coin info
                this.el_widget_info,
                // coin chart
                this.el_widget_chart,
                // coin additional info
                this.el_widget_add_info,
                // coin description
                this.el_widget_description,

            ]
        }))

        if (data) {
            this.render_sections(data);
        }
    }


}

