import create_element from "../custom-functions/create_element.js";

export default class TradeButton extends HTMLElement {
    constructor() {
        super();
    }



    connectedCallback() {
        const btn = create_element({ tag: "button", id: "button-x", class_names: ["button-pink"] });
        btn.textContent = "subscribe"
        this.appendChild(btn);
    }
}

