import create_element from "../custom-functions/create_element.js";

export default class CustomPhoneMenu extends HTMLElement {
    constructor() {
        super();
        this.on_outside_click = this.on_outside_click.bind(this);
        this.on_button_click = this.on_button_click.bind(this);
        this.on_button_back_click = this.on_button_back_click.bind(this);
    }

    connectedCallback() {
        this.render();
        this.init_listeners();
    }
    disconnectedCallback() {
        document?.removeEventListener("click", this.on_outside_click)
        this.el_menu_button?.removeEventListener("click", this.on_button_click)

        this.el_menu_back_button?.removeEventListener("click", this.on_button_back_click)
    }

    render() {
        this.el_menu_button = create_element({
            tag: "button", class_names: ["action-button"], id: "button-menu-bar", childrens: [
                create_element({ tag: "i", class_names: ["ri-menu-line"] })
            ]
        }),
            this.el_menu_back_button = create_element({
                tag: "button", class_names: ["action-button"], id: "phone-button-back-menu", childrens: [
                    create_element({ tag: "i", class_names: ["ri-arrow-go-back-line"] })
                ]
            })
        this.el_phone_menu = create_element({
            tag: "div", id: "phone-nav-menu", childrens: [
                this.el_menu_back_button,
                create_element({
                    tag: "ul", childrens: [
                        create_element({
                            tag: "li", childrens: [
                                create_element({ tag: "a", attrs: { href: "/", "data-spa": true }, text: "صفحه اصلی" })
                            ]
                        }),
                        create_element({
                            tag: "li", childrens: [
                                create_element({ tag: "a", attrs: { href: "/chart", "data-spa": true }, text: "چارت" })
                            ]
                        }),
                        create_element({
                            tag: "li", childrens: [
                                create_element({ tag: "a", attrs: { href: "/about", "data-spa": true }, text: "درباره ی ما" })
                            ]
                        }),
                    ]
                })
            ]
        })
        this.append(this.el_menu_button, this.el_phone_menu);
    }

    on_outside_click(event) {
        if (!this.el_phone_menu.contains(event.target)) {
            this.el_phone_menu.classList.remove("show")
        }
    }

    on_button_click(event) {
        event.stopPropagation();
        this.el_phone_menu.style.display = "flex"
        setTimeout(() => {
            this.el_phone_menu.classList.add("show")
        }, 0);
    }

    on_button_back_click(event) {
        event.stopPropagation();
        this.el_phone_menu.classList.remove("show")
    }

    init_listeners() {
        document.addEventListener("click", this.on_outside_click)
        this.el_menu_button.addEventListener("click", this.on_button_click)

        this.el_menu_back_button.addEventListener("click", this.on_button_back_click)
    }
}