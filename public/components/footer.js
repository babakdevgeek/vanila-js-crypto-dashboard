import create_element from "../custom-functions/create_element.js";

export default class CustomFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.appendChild(create_element({
            tag: "footer", childrens: [
                create_element({ tag: "p", text: "© تمامی حقوق محفوظ است" }),
                create_element({
                    tag: "div", class_names: ["social"], childrens: [
                        create_element({
                            tag: "a", attrs: { href: "https://github.com/babakdevgeek" }, childrens: [
                                create_element({ tag: "i", class_names: ["ri-github-line"] })
                            ]
                        }),
                        create_element({
                            tag: "a", attrs: { href: "https://t.me/truerex" }, childrens: [
                                create_element({ tag: "i", class_names: ["ri-telegram-2-line"] })
                            ]
                        }),
                    ]
                })
            ]
        }))
    }
}