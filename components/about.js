import create_element from "../custom-functions/create_element.js";

export default class CustomAbout extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const text = "این وبسایت بخشی از یک ربات تلگرامی  هلپر است, میتونید از لینک زیر باهاش تماس بگیرید"
        this.appendChild(
            create_element({
                tag: "div", class_names: ["about"], childrens: [
                    create_element({ tag: "p", text, }),
                    create_element({
                        tag: "a", attrs: { href: "https://t.me/YourUserHelperBot" }, childrens: [
                            create_element({ tag: "i", class_names: ["ri-robot-2-line"] })
                        ]
                    })
                ]
            })
        )
    }
}