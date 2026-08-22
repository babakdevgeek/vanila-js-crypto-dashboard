import create_element from "../custom-functions/create_element.js";

export default class CustomThemeButton extends HTMLElement {
    constructor() {
        super();
        this.name_local_storage = "THEME";
    }

    connectedCallback() {
        this.el_button_theme = create_element({
            tag: "button", class_names: ["action-button"], id: "button-theme"
        })

        this.el_i =
            create_element({ tag: "i", class_names: ["ri-moon-cloudy-line"] })
        this.el_button_theme.appendChild(this.el_i);
        this.appendChild(this.el_button_theme);
        this.load()
        this.init_listeners();
    }

    get() {
        const result = localStorage.getItem(this.name_local_storage);
        if (result) {
            return result;
        }
        else {
            return null;
        }
    }

    set(themeName) {
        localStorage.setItem(this.name_local_storage, themeName)
    }

    get_user_device_preference() {
        const user_device_theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

        return user_device_theme
    }

    static get_theme_static() {
        const result = localStorage.getItem("THEME");
        if (result) {
            return result;
        }
        else {
            const user_device_theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            return user_device_theme
        }
    }



    load() {
        const theme_in_local = this.get(this.name_local_storage);

        if (!theme_in_local) {
            const user_device_theme = this.get_user_device_preference()
            this.set(user_device_theme);
            this.apply(user_device_theme)
            return
        }

        this.apply(theme_in_local)
    }

    init_listeners() {
        this.el_button_theme.addEventListener("click", (e) => {
            const theme = this.get()
            const oposite = theme === "dark" ? "light" : "dark"

            this.apply(oposite)
            this.set(oposite)

        })
    }

    get_icon(theme) {
        if (theme === "light") return "ri-moon-cloudy-line"
        if (theme === "dark") return "ri-sun-line"
    }

    apply(theme) {
        const icon = this.get_icon(theme)
        this.el_i.classList = [icon]
        if (theme === "dark") {
            document.documentElement.classList.add("dark")
        }
        if (theme === "light") {
            document.documentElement.classList.remove("dark")
        }
    }
}