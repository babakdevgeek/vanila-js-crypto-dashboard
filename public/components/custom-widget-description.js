import create_element from "../custom-functions/create_element.js";

export default class CustomCoinWidgetDescription extends HTMLElement {
    constructor() {
        super();
        this._info_data = null;
        this.on_accordion_click = this.on_accordion_click.bind(this);
    }

    connectedCallback() {
        this.render();
    }
    disconnectedCallback() {
        this.el_accordion_title.removeEventListener("click", this.on_accordion_click);
    }

    set description_data(data) {
        this._description_data = data;
        this.render(data);
    }

    on_accordion_click(event) {
        const display_state =
            this.el_accordion_body.style.display === "block" ? true : false;
        if (!display_state) {
            this.el_accordion_body.style.display = "block";
            this.el_accordion_title_icon.style.transform = "rotate(180deg)";
        }
        if (display_state) {
            this.el_accordion_body.style.display = "none";
            this.el_accordion_title_icon.style.transform = "rotate(0)";
        }
    }

    render(data) {
        this.innerHTML = "";
        this.el_accordion_title_icon = create_element({ tag: "i", class_names: ["ri-arrow-down-wide-line"] });
        this.el_accordion_title = create_element({
            tag: "div", class_names: ["accordion-title"], childrens: [
                create_element({ "tag": "span", text: "درباره ی ارز", childrens: [create_element({ tag: "b" })] }),
                create_element({ tag: "span", childrens: [this.el_accordion_title_icon] })
            ]
        });
        this.el_accordion_body = create_element({ tag: "div", class_names: ["accordion-body"], childrens: [create_element({ tag: "p" })] });
        this.el_description = create_element({
            tag: "div", childrens: [
                create_element({
                    tag: "div", class_names: ["accordion"], childrens: [
                        this.el_accordion_title,
                        this.el_accordion_body
                    ]
                })
            ]
        });

        this.appendChild(this.el_description);
        this.classList.add("coin-description", "skeleton")

        if (data) {
            this.classList.remove("skeleton");
            const name = data.name;
            const desc = data.description.en;

            this.el_description.querySelector("b").textContent = name;
            this.el_description.querySelector("p").textContent = desc;

            this.el_accordion_title.addEventListener("click", this.on_accordion_click)
        }
    }
}