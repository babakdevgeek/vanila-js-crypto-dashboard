import create_element from "../custom-functions/create_element.js";

export default class CustomTableWidget extends HTMLElement {
    constructor() {
        super();
        this.key = "coins";
        this.h_text = "اخیرا محبوب";
    }

    connectedCallback() {
        this.render();
        this.addEventListener("click", this.onClick.bind(this))
    }

    onClick(event) {
        const our_button = event.target.closest("button");
        if (!our_button) return;
        this.widget_table_container.innerHTML = "";
        Array.from(this.querySelectorAll("button")).filter(in_b => in_b !== our_button).forEach(btn => btn.classList.remove("active"));

        our_button.classList.add("active");
        if (our_button.dataset.showCoins) {
            this.widget_table_container.appendChild(create_element({ tag: "custom-coins-table" }));
        }
        if (our_button.dataset.showNfts) {
            this.widget_table_container.appendChild(create_element({ tag: "custom-nfts-table" }));
        }
        if (our_button.dataset.showCategories) {
            this.widget_table_container.appendChild(create_element({ tag: "custom-categories-table" }));
        }

    }

    render() {

        this.h = create_element({ tag: "h1", class_names: ["title"], text: this.h_text })
        this.widget_container = create_element({ tag: "div", class_names: ["table-widget"] });



        this.widget_button_coins = create_element({
            tag: "button", text: "ارز", class_names: ["active"], attrs: { "data-show-coins": true }, childrens: [
                create_element({ tag: "i", class_names: ["ri-btc-line"] })
            ]
        })
        this.widget_button_nfts = create_element({
            tag: "button", text: "nft", attrs: { "data-show-nfts": true }, childrens: [
                create_element({ tag: "i", class_names: ["ri-nft-line"] })
            ]
        })
        this.widget_button_categories = create_element({
            tag: "button", text: "دسته بندی", attrs: { "data-show-categories": true }, childrens: [
                create_element({ tag: "i", class_names: ["ri-book-shelf-line"] })
            ]
        })
        this.widget_container.append(this.widget_button_coins, this.widget_button_nfts, this.widget_button_categories);

        this.widget_table_container = create_element({
            tag: "div", childrens: [
                create_element({ tag: "custom-coins-table" })
            ]
        });

        this.append(this.h, this.widget_container, this.widget_table_container);
    }
}