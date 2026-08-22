import create_element from "../custom-functions/create_element.js";
import { router } from "../index.js";

export default class CustomCoinWidgetChart extends HTMLElement {
    constructor() {
        super();
        this.on_render_chart_button = this.on_render_chart_button.bind(this);
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        if (this.button) {
            this.button.removeEventListener("click", this.on_render_chart_button);
        }
    }

    set chart_data(data) {
        this._chart_data = data;
        this.render(data);
    }

    on_render_chart_button(event) {
        const href = `/chart/${this._chart_data.symbol}`;
        router.push(href);
    }

    render(data) {
        this.innerHTML = "";
        this.el_chart_container = create_element({ tag: "div", class_names: ["coin-chart-container"] })
        this.el_chart = create_element({
            tag: "div", childrens: [
                create_element({
                    tag: "div", class_names: ["coin-chart-top"], childrens: [
                        create_element({
                            tag: "h2", text: "نمای یکماهه ی ", childrens: [
                                create_element({ tag: "span" })
                            ]
                        }),
                        create_element({ tag: "button", class_names: ["btn"], text: "چارت کندلی" })
                    ]
                }),
                this.el_chart_container
            ]
        });

        this.appendChild(this.el_chart)
        this.classList.add("coin-chart", "skeleton");
        if (data) {
            this.classList.remove("skeleton");
            const symbol = data.symbol.toUpperCase();
            const name = data.name;
            // Custom element of tradingview
            this.el_custom = create_element({ tag: "tv-mini-chart" });
            this.el_custom.setAttribute("symbol", `MEXC:${symbol}USDT`);
            // this.el_custom.setAttribute("theme", Theme.get_theme_static());
            this.el_custom.setAttribute("time-frame", "1M");

            // script of tradingview
            const script = create_element({ tag: "script" });
            script.type = "module";
            script.src = "https://widgets.tradingview-widget.com/w/en/tv-mini-chart.js";
            this.el_chart_container.append(script, this.el_custom);

            this.el_chart.querySelector(".coin-chart-top span").textContent = name;
            this.button = this.el_chart.querySelector("button");
            this.button.addEventListener("click", this.on_render_chart_button)
        }
    }
}